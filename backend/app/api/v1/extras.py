import calendar
import re
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ...core import sb, current_user, audit, fetch_all

router = APIRouter(tags=["extras"])
now = lambda: datetime.now(timezone.utc)
iso = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
SAJ = ("autorise", "non_autorise", "bloque")


def add_months(d, m):
    y, mo = divmod(d.month - 1 + m, 12)
    return d.replace(year=d.year + y, month=mo + 1, day=min(d.day, calendar.monthrange(d.year + y, mo + 1)[1]))


class TasjilIn(BaseModel):
    result_status: Literal["autorise", "non_autorise", "bloque", "enregistre_temporairement", "a_verifier", "erreur"]
    source: Optional[str] = None
    message: Optional[str] = None


class StatusIn(BaseModel):
    status: Literal["in_stock", "repair", "defective"]
    reason: str


class SajIn(BaseModel):
    sajalni_status: Optional[Literal["autorise", "non_autorise", "bloque"]] = None


def _dev(device_id):
    r = sb.table("devices").select("*").eq("id", device_id).is_("deleted_at", "null").execute().data
    if not r:
        raise HTTPException(404, "Phone not found")
    return r[0]


@router.post("/devices/{device_id}/tasjil-checks", status_code=201)
def add_check(device_id: str, t: TasjilIn, user=Depends(current_user)):
    d = _dev(device_id)
    row = sb.table("tasjil_checks").insert({"device_id": device_id, "imei_checked": d["imei1"], "serial_checked": d["serial_number"],
                                            "result_status": t.result_status, "source": t.source, "message": t.message,
                                            "checked_by": user.id}).execute().data[0]
    if t.result_status in SAJ:
        sb.table("devices").update({"sajalni_status": t.result_status, "updated_at": now().isoformat()}).eq("id", device_id).execute()
    audit(user, "tasjil.check", "tasjil_check", row["id"], t.result_status)
    return row


@router.get("/devices/{device_id}/tasjil-checks")
def list_checks(device_id: str, user=Depends(current_user)):
    return sb.table("tasjil_checks").select("*").eq("device_id", device_id).order("checked_at", desc=True).execute().data


@router.patch("/devices/{device_id}/sajalni")
def set_sajalni(device_id: str, s: SajIn, user=Depends(current_user)):
    """Edit ONLY the Sajalni status (works for sold phones too)."""
    _dev(device_id)
    sb.table("devices").update({"sajalni_status": s.sajalni_status, "updated_at": now().isoformat()}).eq("id", device_id).execute()
    audit(user, "device.sajalni", "device", device_id, f"Sajalni → {s.sajalni_status or 'not checked'}")
    return {"ok": True}


@router.post("/devices/{device_id}/status")
def set_status(device_id: str, s: StatusIn, user=Depends(current_user)):
    if not s.reason.strip():
        raise HTTPException(400, "A reason is required")
    _dev(device_id)
    sb.table("devices").update({"status": s.status, "status_reason": s.reason.strip(), "updated_at": now().isoformat()}).eq("id", device_id).execute()
    audit(user, "device.status", "device", device_id, f"Status → {s.status}: {s.reason.strip()}")
    return {"ok": True}


@router.get("/devices/{device_id}/history")
def history(device_id: str, user=Depends(current_user)):
    d = _dev(device_id)
    ev = [{"at": d["created_at"], "text": "Added" + (f" — {d['model']}" if d.get("model") else "")}]
    for a in sb.table("audit_log").select("*").eq("entity_id", device_id).execute().data:
        ev.append({"at": a["created_at"], "text": "Edited" if a["action"] == "device.update" else (a["summary"] or a["action"])})
    for s in sb.table("sales").select("*").eq("device_id", device_id).execute().data:
        ev.append({"at": s["sale_date"], "text": f"Sold to {s['client_name'] or '?'} by {s['seller_name'] or '?'}" +
                   (f" for {s['sale_price']} TND" if s["sale_price"] is not None else "")})
    for c in sb.table("tasjil_checks").select("*").eq("device_id", device_id).execute().data:
        ev.append({"at": c["checked_at"], "text": f"Sajalni check: {c['result_status']} ({c['source'] or '—'})"})
    return sorted(ev, key=lambda e: e["at"], reverse=True)


@router.get("/alerts")
def alerts(days: int = 30, user=Depends(current_user)):
    cut = now() - timedelta(days=days)
    devs = fetch_all(lambda: sb.table("devices").select("id,model,category,imei1,imei2,serial_number,purchase_date,sajalni_status")
                     .eq("status", "in_stock").is_("deleted_at", "null").order("id"))
    last = {}
    for c in fetch_all(lambda: sb.table("tasjil_checks").select("device_id,checked_at,result_status").order("checked_at", desc=True).order("id")):
        last.setdefault(c["device_id"], c)
    never, old, slow = [], [], []
    for d in devs:
        if d["category"] == "parallele":
            c = last.get(d["id"])
            if not c:
                never.append(d)
            elif iso(c["checked_at"]) < cut or c["result_status"] in ("a_verifier", "erreur"):
                old.append(d)
        if iso(d["purchase_date"]) < cut:
            slow.append({**d, "days": (now() - iso(d["purchase_date"])).days})
    wl = []  # warranties (phone 12 months, battery 3 months) ending soon
    for s in fetch_all(lambda: sb.table("sales").select("id,sale_date,client_name,devices(model,imei1)")
                       .gte("sale_date", (now() - timedelta(days=370)).isoformat()).order("id")):
        for kind, m in (("phone", 12), ("battery", 3)):
            end = add_months(iso(s["sale_date"]), m)
            if now() <= end <= now() + timedelta(days=days):
                dv = s.get("devices") or {}
                wl.append({"kind": kind, "model": dv.get("model"), "imei1": dv.get("imei1"), "client_name": s["client_name"],
                           "ends": end.isoformat(), "days": (end - now()).days})
    return {"never": never, "old": old, "slow": sorted(slow, key=lambda x: -x["days"]), "warranty": wl,
            "blocked": [d for d in devs if d["sajalni_status"] == "bloque"]}


@router.get("/warranty/{code}")
def warranty(code: str, user=Depends(current_user)):
    """Warranty lookup by IMEI / serial: returns the sold phone with its latest sale."""
    if not re.fullmatch(r"[A-Za-z0-9]{4,40}", code):
        raise HTTPException(400, "Invalid code")
    rows = sb.table("devices").select("*, sales!inner(*)").is_("deleted_at", "null").or_(
        f"imei1.eq.{code},imei2.eq.{code},serial_number.eq.{code}").execute().data
    if not rows:
        raise HTTPException(404, "No sold phone with this IMEI / Serial Number")
    d = rows[0]
    s = d.pop("sales")
    d["sale"] = max(s, key=lambda x: x["sale_date"]) if isinstance(s, list) else s
    return d


@router.get("/tasjil/last")
def tasjil_last(user=Depends(current_user)):
    out = {}
    for c in fetch_all(lambda: sb.table("tasjil_checks").select("device_id,checked_at,result_status").order("checked_at", desc=True).order("id")):
        out.setdefault(c["device_id"], {**c, "n": 0})["n"] += 1
    return out


@router.get("/export/{kind}")
def export(kind: str, user=Depends(current_user)):
    cols = "category,model,color,ram,rom,imei1,imei2,serial_number,supplier_name,purchase_price,sajalni_status"
    if kind == "stock":
        return fetch_all(lambda: sb.table("devices").select(cols + ",purchase_date,expected_sale_price,notes")
                         .eq("status", "in_stock").is_("deleted_at", "null").order("id"))
    if kind == "sales":
        out = []
        for d in fetch_all(lambda: sb.table("devices").select(cols + ", sales!inner(sale_date,sale_price,seller_name,client_name)").eq("status", "sold").order("id")):
            s = d.pop("sales")
            out.append({**d, **(max(s, key=lambda x: x["sale_date"]) if isinstance(s, list) else s)})
        return out
    if kind == "tasjil":
        return fetch_all(lambda: sb.table("tasjil_checks").select("checked_at,imei_checked,serial_checked,result_status,source,message").order("checked_at", desc=True).order("id"))
    raise HTTPException(404, "Unknown export")

import re
from datetime import datetime, timezone
from typing import Literal, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from ...core import sb, current_user, audit, paged, clean_date, fetch_all

router = APIRouter(prefix="/repairs", tags=["repairs"])
now = lambda: datetime.now(timezone.utc).isoformat()
ts = lambda d: f"{d}T12:00:00+01:00"
Status = Literal["received", "in_repair", "ready", "delivered"]


class RepairIn(BaseModel):
    owner_name: str
    owner_phone: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None
    imei1: Optional[str] = None
    issue: Optional[str] = None
    price: Optional[float] = None
    notes: Optional[str] = None
    status: Status = "received"
    received_date: Optional[str] = None
    delivered_date: Optional[str] = None

    @field_validator("owner_phone", "model", "color", "imei1", "issue", "notes", "received_date", "delivered_date", mode="before")
    @classmethod
    def blank_to_none(cls, v):
        return None if v is None else (str(v).strip() or None)

    @field_validator("owner_name")
    @classmethod
    def need_owner(cls, v):
        if not v.strip():
            raise ValueError("Owner name is required")
        return v.strip()

    @field_validator("received_date", "delivered_date")
    @classmethod
    def date_ok(cls, v):
        if v and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", v):
            raise ValueError("Invalid date")
        return v


class StatusIn(BaseModel):
    status: Status


def _data(r: RepairIn, old=None):
    d = r.model_dump(exclude={"received_date", "delivered_date"})
    d["updated_at"] = now()
    if r.received_date:
        d["received_at"] = ts(r.received_date)
    if r.status == "delivered":  # date given to the client: typed by you, else today (or the one already saved)
        d["delivered_at"] = ts(r.delivered_date) if r.delivered_date else ((old or {}).get("delivered_at") or now())
    else:
        d["delivered_at"] = None
    return d


def _get(rid):
    r = sb.table("repairs").select("*").eq("id", rid).is_("deleted_at", "null").execute().data
    if not r:
        raise HTTPException(404, "Repair not found")
    return r[0]


@router.post("", status_code=201)
def create(r: RepairIn, user=Depends(current_user)):
    row = sb.table("repairs").insert(_data(r)).execute().data[0]
    audit(user, "repair.create", "repair", row["id"], r.owner_name)
    return row


@router.get("")
def list_repairs(status: Optional[str] = None, q: Optional[str] = None, page: int = 1, page_size: int = 10,
                 date_from: Optional[str] = None, date_to: Optional[str] = None, user=Depends(current_user)):
    qry = sb.table("repairs").select("*", count="exact").is_("deleted_at", "null").order("received_at", desc=True)
    if status:
        qry = qry.eq("status", status)
    if clean_date(date_from):
        qry = qry.gte("received_at", date_from)
    if clean_date(date_to):
        qry = qry.lte("received_at", date_to + "T23:59:59")
    if q:
        if not re.fullmatch(r"[\w .+-]{1,40}", q):
            raise HTTPException(400, "Invalid search text")
        qry = qry.or_(f"owner_name.ilike.%{q}%,owner_phone.ilike.%{q}%,model.ilike.%{q}%,imei1.ilike.%{q}%,issue.ilike.%{q}%")
    items, total, page, page_size = paged(qry, page, page_size)
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.get("/counts")
def counts(user=Depends(current_user)):
    rows = fetch_all(lambda: sb.table("repairs").select("status").is_("deleted_at", "null").order("id"))
    out = {"all": len(rows)}
    for r in rows:
        out[r["status"]] = out.get(r["status"], 0) + 1
    return out


@router.patch("/{repair_id}")
def update(repair_id: str, r: RepairIn, user=Depends(current_user)):
    old = _get(repair_id)
    row = sb.table("repairs").update(_data(r, old)).eq("id", repair_id).execute().data[0]
    audit(user, "repair.update", "repair", repair_id, r.status)
    return row


@router.patch("/{repair_id}/status")
def set_status(repair_id: str, s: StatusIn, user=Depends(current_user)):
    old = _get(repair_id)
    sb.table("repairs").update({"status": s.status, "updated_at": now(),
                                "delivered_at": (old.get("delivered_at") or now()) if s.status == "delivered" else None}).eq("id", repair_id).execute()
    audit(user, "repair.status", "repair", repair_id, s.status)
    return {"ok": True}


@router.delete("/{repair_id}")
def delete(repair_id: str, user=Depends(current_user)):
    _get(repair_id)
    sb.table("repairs").update({"deleted_at": now()}).eq("id", repair_id).execute()
    audit(user, "repair.delete", "repair", repair_id)
    return {"ok": True}

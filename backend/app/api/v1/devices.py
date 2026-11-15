import re
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from ...core import sb, current_user, audit, apply_search, paged, clean_date
from ...schemas import DeviceIn

router = APIRouter(prefix="/devices", tags=["devices"])
now = lambda: datetime.now(timezone.utc).isoformat()


def _find_duplicate(d: DeviceIn, exclude_id=None):
    vals = [v for v in (d.imei1, d.imei2, d.serial_number) if v]
    if not vals:
        return None
    cond = ",".join(f"imei1.eq.{v},imei2.eq.{v},serial_number.eq.{v}" for v in vals)
    for h in sb.table("devices").select("id,imei1,imei2,serial_number").is_("deleted_at", "null").or_(cond).execute().data:
        if h["id"] != exclude_id:
            return next((v for v in vals if v in (h["imei1"], h["imei2"], h["serial_number"])), vals[0])
    return None


def _get(device_id):
    rows = sb.table("devices").select("*").eq("id", device_id).is_("deleted_at", "null").execute().data
    if not rows:
        raise HTTPException(404, "Phone not found")
    return rows[0]


@router.post("", status_code=201)
def create_device(d: DeviceIn, user=Depends(current_user)):
    dup = _find_duplicate(d)
    if dup:
        raise HTTPException(409, f"This phone already exists ({dup})")
    data = d.model_dump(exclude_none=True)
    if d.is_repair:  # repaired phone nobody collected: it is SOLD, so it stays in stock; no supplier / Sajalni status
        data.pop("supplier_name", None)
        data.pop("sajalni_status", None)
    row = sb.table("devices").insert(data).execute().data[0]
    audit(user, "device.create", "device", row["id"], d.model or "")
    return row


@router.get("")
def list_devices(status: Optional[str] = None, category: Optional[str] = None, q: Optional[str] = None,
                 page: int = 1, page_size: int = 10, date_from: Optional[str] = None,
                 date_to: Optional[str] = None, is_repair: Optional[bool] = None, user=Depends(current_user)):
    qry = sb.table("devices").select("*", count="exact").is_("deleted_at", "null").order("created_at", desc=True)
    if status:
        qry = qry.eq("status", status)
    if category:
        qry = qry.eq("category", category)
    if is_repair is not None:
        qry = qry.eq("is_repair", is_repair)
    if clean_date(date_from):
        qry = qry.gte("purchase_date", date_from)
    if clean_date(date_to):
        qry = qry.lte("purchase_date", date_to + "T23:59:59")
    items, total, page, page_size = paged(apply_search(qry, q), page, page_size)
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.get("/lookup/{code}")
def lookup(code: str, user=Depends(current_user)):
    if not re.fullmatch(r"[A-Za-z0-9._-]{4,40}", code):
        raise HTTPException(400, "Invalid code")
    rows = sb.table("devices").select("*").is_("deleted_at", "null").or_(
        f"imei1.eq.{code},imei2.eq.{code},serial_number.eq.{code}").execute().data
    if not rows:
        raise HTTPException(404, "No phone with this IMEI / Serial Number")
    return rows[0]


@router.get("/{device_id}")
def read_device(device_id: str, user=Depends(current_user)):
    return _get(device_id)


@router.patch("/{device_id}")
def update_device(device_id: str, d: DeviceIn, user=Depends(current_user)):
    _get(device_id)
    dup = _find_duplicate(d, exclude_id=device_id)
    if dup:
        raise HTTPException(409, f"Another phone already uses {dup}")
    data = d.model_dump()
    if d.is_repair:
        data["supplier_name"] = data["sajalni_status"] = None
    data["updated_at"] = now()
    row = sb.table("devices").update(data).eq("id", device_id).execute().data[0]
    audit(user, "device.update", "device", device_id, d.model or "")
    return row


@router.delete("/{device_id}")
def delete_device(device_id: str, user=Depends(current_user)):
    cur = _get(device_id)
    if cur["status"] not in ("in_stock", "repair"):
        raise HTTPException(409, "Sold phones are kept for the sales history")
    sb.table("devices").update({"deleted_at": now(), "updated_at": now()}).eq("id", device_id).execute()
    audit(user, "device.delete", "device", device_id, cur.get("model") or "")
    return {"ok": True}

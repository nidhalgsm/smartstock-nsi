import re
import time
from concurrent.futures import ThreadPoolExecutor
from fastapi import Header, HTTPException
from pydantic_settings import BaseSettings
from supabase import create_client


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    cors_origins: str = "http://localhost:5500"
    model_config = {"env_file": ".env"}


settings = Settings()
sb = create_client(settings.supabase_url, settings.supabase_service_key)


_USERS = {}  # token -> (expires_at, user): Supabase verified it, we trust it for 2 minutes
_POOL = ThreadPoolExecutor(max_workers=2)


def current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization[7:]
    hit = _USERS.get(token)
    if hit and hit[0] > time.time():
        return hit[1]
    try:
        res = sb.auth.get_user(token)
        if not res or not res.user:
            raise ValueError
    except Exception:
        raise HTTPException(401, "Invalid or expired session")
    if len(_USERS) > 200:
        _USERS.clear()
    _USERS[token] = (time.time() + 120, res.user)
    return res.user


def audit(user, action, entity_type, entity_id, summary=""):
    row = {"user_id": user.id, "action": action, "entity_type": entity_type, "entity_id": str(entity_id), "summary": summary}

    def run():  # written in the background: the user does not wait for it
        try:
            sb.table("audit_log").insert(row).execute()
        except Exception:
            pass
    _POOL.submit(run)


def apply_search(qry, q):
    if q:
        if not re.fullmatch(r"[\w .-]{1,40}", q):
            raise HTTPException(400, "Invalid search text")
        qry = qry.or_(f"imei1.ilike.%{q}%,imei2.ilike.%{q}%,serial_number.ilike.%{q}%,model.ilike.%{q}%,"
                      f"supplier_name.ilike.%{q}%,owner_name.ilike.%{q}%")
    return qry


def paged(qry, page, page_size):
    page, page_size = max(1, page), min(max(1, page_size), 50)
    start = (page - 1) * page_size
    try:
        r = qry.range(start, start + page_size - 1).execute()
        items = r.data
    except Exception:  # page beyond the last one
        r, items = qry.range(0, 0).execute(), []
    return items, (r.count or 0), page, page_size


def fetch_all(make):
    """Supabase returns max 1000 rows per request: read every page."""
    out, i = [], 0
    while True:
        rows = make().range(i, i + 999).execute().data
        out += rows
        if len(rows) < 1000:
            return out
        i += 1000


def clean_date(s):
    if s and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        raise HTTPException(400, "Invalid date")
    return s

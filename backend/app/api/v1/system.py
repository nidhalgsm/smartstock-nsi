import time
from fastapi import APIRouter, Depends
from ...core import sb, current_user

router = APIRouter(prefix="/system", tags=["system"])
# (table, column, migration that adds it)
PROBES = [("devices", "sajalni_status", "002"), ("devices", "status_reason", "003"), ("devices", "color", "004"), ("devices", "ram", "004"), ("devices", "rom", "004"),
          ("sales", "client_name", "004"), ("devices", "owner_name", "005"), ("devices", "is_repair", "005"), ("repairs", "owner_name", "006")]
_CACHE = {}


@router.get("/check")
def check(user=Depends(current_user)):
    """Tells which database migrations are missing (the app shows a red banner)."""
    if _CACHE and time.time() - _CACHE["t"] < 300:
        return _CACHE["v"]
    missing = []
    for t, c, m in PROBES:
        try:
            sb.table(t).select(c).limit(1).execute()
        except Exception as e:
            missing.append({"table": t, "column": c, "migration": m, "error": str(getattr(e, "message", None) or e)[:120]})
    try:
        sb.rpc("dashboard_summary", {}).execute()
    except Exception:
        missing.append({"table": "function", "column": "dashboard_summary", "migration": "007", "error": "optional: only makes the dashboard faster"})
    out = {"ok": not [x for x in missing if x["migration"] != "007"], "missing": missing, "migrations_to_run": sorted({x["migration"] for x in missing})}
    _CACHE.update(t=time.time(), v=out)
    return out

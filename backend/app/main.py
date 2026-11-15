import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from .core import settings
from .api.v1 import devices, sales, dashboard, extras, repairs

app = FastAPI(title="SmartStock TN API")


@app.middleware("http")
async def json_errors(request, call_next):
    """Any unexpected error (e.g. a database error) becomes a readable JSON message.
    Added BEFORE the CORS middleware so the browser can still read it (otherwise it only sees 'Failed to fetch')."""
    try:
        return await call_next(request)
    except Exception as e:
        logging.exception("Unhandled error on %s", request.url.path)
        return JSONResponse({"detail": "Server error: " + str(getattr(e, "message", None) or e)[:300]}, status_code=500)


app.add_middleware(GZipMiddleware, minimum_size=800)
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
                   allow_methods=["*"], allow_headers=["*"])
for r in (devices.router, sales.router, dashboard.router, extras.router, repairs.router):
    app.include_router(r, prefix="/api/v1")


@app.get("/health")
def health():
    return {"ok": True}

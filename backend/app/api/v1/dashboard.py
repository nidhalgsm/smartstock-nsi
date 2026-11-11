from fastapi import APIRouter, Depends
from ...core import sb, current_user, fetch_all

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def summary(user=Depends(current_user)):
    devs = fetch_all(lambda: sb.table("devices").select("category,status,purchase_price,sajalni_status")
                     .is_("deleted_at", "null").order("id"))
    stock = [d for d in devs if d["status"] == "in_stock"]
    sales = fetch_all(lambda: sb.table("sales").select("sale_price, devices(purchase_price)").order("id"))
    priced = [s for s in sales if s["sale_price"] is not None and s["devices"] and s["devices"]["purchase_price"] is not None]
    return {
        "in_stock": len(stock),
        "blocked_in_stock": sum(d["sajalni_status"] == "bloque" for d in stock),
        "sold": sum(d["status"] == "sold" for d in devs),
        "tunisien": sum(d["category"] == "tunisien" for d in stock),
        "parallele": sum(d["category"] == "parallele" for d in stock),
        "stock_value_tnd": sum(float(d["purchase_price"] or 0) for d in stock),
        "revenue_tnd": sum(float(s["sale_price"]) for s in sales if s["sale_price"] is not None),
        "gross_margin_tnd": sum(float(s["sale_price"]) - float(s["devices"]["purchase_price"]) for s in priced),
    }

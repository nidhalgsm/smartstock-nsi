"""Static cross-check: frontend API calls <-> backend routes <-> database columns. Run: python tools/check_contract.py"""
import glob, os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = lambda *p: open(os.path.join(root, *p), encoding="utf-8").read(); bad = []
routes = set()
for f in glob.glob(f"{root}/backend/app/api/v1/*.py"):
    s = open(f).read(); m = re.search(r'APIRouter\(([^)]*)\)', s); pre = (re.search(r'prefix="([^"]*)"', m.group(1)) or [0, ""])[1] if m else ""
    for _, p in re.findall(r'@router\.(get|post|patch|delete|put)\("([^"]*)"', s): routes.add(pre + re.sub(r"\{[^}]+\}", "{}", p))
js = R("frontend", "app.js")
for line in js.splitlines():
    if "api(" in line:
        for lit in re.findall(r'["`](/[a-zA-Z][^"`]*)["`]', line):
            c = re.sub(r"\$\{[^}]*\}", "{}", lit.split("?")[0])
            if not (c in routes or (c.endswith("/") and any(r.startswith(c) for r in routes))): bad.append(f"frontend calls unknown route {c}")
sql = R("database", "01_schema_fresh_install.sql"); sch = R("backend", "app", "schemas.py")
cols = set(re.findall(r"\b(\w+) (?:uuid|text|smallint|boolean|numeric\(\d+,\d+\)|timestamptz)(?!\w)", re.search(r"create table devices \((.*?)\n\);", sql, re.S).group(1)))
fields = re.findall(r"^    (\w+):", sch.split("class DeviceIn")[1].split("class SaleIn")[0], re.M)
bad += [f"DeviceIn field {f} is not a devices column" for f in fields if f not in cols]
body = re.search(r"const body = \{(.*?)\};", js, re.S).group(1); keys = re.findall(r"(\w+):", body)
bad += [f"frontend sends {k} not accepted by DeviceIn" for k in keys if k not in fields]
sale = re.search(r'api\("/sales", \{ method: "POST", body: JSON.stringify\(\{(.*?)\}\)', js, re.S).group(1)
bad += [f"frontend sale field {k} unknown" for k in re.findall(r"(\w+):", sale) if k not in re.findall(r"^    (\w+):", sch.split("class SaleIn")[1], re.M)]
rpc = set(re.findall(r'"(p_\w+)"', R("backend", "app", "api", "v1", "sales.py"))); fn = set(re.findall(r"\b(p_\w+) ", re.search(r"function sell_device\((.*?)\)", sql).group(1)))
if rpc != fn: bad.append(f"sell_device params differ: {rpc ^ fn}")
mig = "".join(open(f).read() for f in sorted(glob.glob(f"{root}/database/migrations/*.sql")))
for c in ("sajalni_status", "color", "ram", "rom", "owner_name", "is_repair", "status_reason", "client_name"):
    if c not in mig: bad.append(f"no migration adds {c}")
for w in ("delete from", "drop table", "truncate"):
    if w in (mig + sql).lower(): bad.append(f"SQL contains destructive statement: {w}")
print("routes:", len(routes)); print("\n".join(bad) if bad else "CONTRACT OK"); sys.exit(1 if bad else 0)

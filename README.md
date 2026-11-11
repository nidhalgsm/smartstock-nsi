# SmartStock TN — final project
```
smartstock-final/
├── backend/    FastAPI (Render)   app/{main,core,schemas}.py, app/api/v1/{devices,sales,dashboard,extras}.py, tests/
├── frontend/   plain HTML/CSS/JS  index.html, styles.css, app.js, config.js   (Netlify)
├── database/   01_schema_fresh_install.sql + migrations/002..005   (Supabase)
├── tools/      check_contract.py, smoke_test.js
└── netlify.toml  (publish = "frontend", no build command)
```
## 1. Database (Supabase SQL Editor) — never deletes data
* Existing database: run `database/migrations/002` → `005` in order (safe to re-run).
* Empty project: run `database/01_schema_fresh_install.sql` only.
## 2. Backend (Render)
Root Directory `backend` · Build `pip install -r requirements.txt` · Start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
Env: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (service_role / secret key), `CORS_ORIGINS` (your Netlify URL, no trailing slash), `PYTHON_VERSION=3.12.7`.
## 3. Frontend (Netlify)
Edit `frontend/config.js` (Supabase URL, **anon** key, Render URL ending `/api/v1`). Deploy the `frontend` folder (no build command).
## 4. Checks you can re-run
```
python tools/check_contract.py        # frontend calls <-> backend routes <-> DB columns
node tools/smoke_test.js              # opens every page with fake data
cd backend && pip install -r requirements.txt && python -m unittest discover -s tests
```

## Notes (v5)
* Blank-screen fix: `boot()` no longer calls Supabase inside `onAuthStateChange` (it could deadlock); `index.html` shows a loader / error / reload link instead of a black page, loads Supabase from a second CDN if the first fails, and `netlify.toml` sends `Cache-Control: no-cache` so old files are never mixed with new ones.
* Icons: monochrome line icons (inline SVG, `ICONS` in `frontend/app.js`) follow the text color. Add one by adding a name to `ICONS` and writing `{{name}}` in any rendered text.
* Keep your own `frontend/config.js` when updating.

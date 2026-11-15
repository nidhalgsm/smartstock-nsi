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
* Existing database: run `database/migrations/002` ... `007` in order (safe to re-run).
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

## Notes (v6)
* New: Repairs (repair tickets, own table), Warranty lookup + QR on the receipt, notification bell, Ctrl+K quick search, accent colour, saved filters, blurred shop background (`frontend/bg.jpg`), installable on phones (bottom navigation bar, `manifest.json`).
* "Repaired phone" in Add phone = phones nobody collected: they stay in stock and are SOLD. Customer repairs live in the Repairs page.
* Scanning: camera (Chrome Android: built-in detector; PC/iPhone/Firefox: ZXing library) and USB/Bluetooth scanners (Enter moves to the next field).
* Database: run `database/migrations/006_repairs_and_sellable_repaired.sql`.

## Images are code now (v7)
`frontend/assets.js` contains the logo, app icons and background image as data URIs and applies them (background, favicon, phone home-screen icon, install manifest). No separate image files are needed.
To change an image: replace it in `design/` and run `python tools/build_assets.py` (then `--check` to verify).

## Speed notes (v8)
* Run `database/migrations/007_performance.sql` (search indexes + dashboard in one SQL call). The backend still works without it, only slower.
* Render free servers sleep after ~15 min: the first request then takes 30-60 s. The site now wakes the server as soon as the page opens; to keep it awake, create a free monitor (UptimeRobot / cron-job.org) that opens `https://YOUR-SERVICE.onrender.com/health` every 5 minutes.
* Keep Render and Supabase in the same region (EU), every request makes several database calls.
* Lite mode (lightning button, automatic on phones and weak PCs) removes blur and animations.
* When you edit `app.js`, `styles.css` or `assets.js`, change `?v=7` to `?v=8` in `index.html` (they are cached for a year).

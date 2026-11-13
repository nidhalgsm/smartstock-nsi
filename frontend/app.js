// ---------- line icons (monochrome, follow the text color) ----------
const ICONS = {
  dash: `<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>`,
  box: `<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  banknote: `<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>`,
  receipt: `<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>`,
  shield: `<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>`,
  toolbox: `<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5h6v3M3 13h18"/>`,
  eye: `<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  pencil: `<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14 6 4 4"/>`,
  trash: `<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  sliders: `<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>`,
  undo: `<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>`,
  camera: `<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>`,
  copy: `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>`,
  external: `<path d="M7 17 17 7M8 7h9v9"/>`,
  download: `<path d="M12 4v11m-5-4 5 5 5-5M4 20h16"/>`,
  printer: `<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>`,
  check_circle: `<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>`,
  alert: `<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5h.01"/>`,
  ban: `<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>`,
  hourglass: `<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>`,
  search: `<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>`,
  alert_circle: `<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5h.01"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>`,
  heart: `<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>`,
  x_circle: `<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>`,
  wrench: `<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>`,
  phone: `<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>`,
  check: `<path d="m5 12 5 5 9-10"/>`,
  x: `<path d="m6 6 12 12M18 6 6 18"/>`,
  arrow_left: `<path d="M19 12H5m6-6-6 6 6 6"/>`,
  arrow_right: `<path d="M5 12h14m-6-6 6 6-6 6"/>`,
  bell: `<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20h4"/>`,
  message: `<path d="M4 5h16v11H9l-5 4z"/>`,
  award: `<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>`,
  contrast: `<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>`
};
const ic = n => ICONS[n] ? `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>` : "";
// double-brace tokens in any HTML we render become icons
if (typeof Element !== "undefined") { const d = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
  Object.defineProperty(Element.prototype, "innerHTML", { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, typeof v === "string" ? v.replace(/\{\{(\w+)\}\}/g, (m, n) => ic(n)) : v); } }); }
const $ = id => document.getElementById(id), esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const fmt = n => n == null ? "—" : Number(n).toFixed(3) + " TND", fdate = s => s ? new Date(s).toLocaleString("fr-FR", { timeZone: "Africa/Tunis" }) : "—";
const SAJ = { autorise: "Autorisé", non_autorise: "Non autorisé", bloque: "Bloqué" }, RES = { ...SAJ, enregistre_temporairement: "Enregistré temporairement", a_verifier: "À vérifier", erreur: "Erreur de vérification" };
const ICON = { autorise: "{{check_circle}}", non_autorise: "{{alert}}", bloque: "{{ban}}", enregistre_temporairement: "{{hourglass}}", a_verifier: "{{search}}", erreur: "{{alert_circle}}" }, CAT = { tunisien: "Tunisien", parallele: "Parallèle" };
const COLORS = "Black,White,Silver,Gray,Space Gray,Graphite,Gold,Rose Gold,Champagne,Blue,Navy Blue,Sky Blue,Ice Blue,Midnight,Starlight,Green,Mint,Olive,Forest Green,Red,Crimson,Burgundy,Pink,Purple,Deep Purple,Lavender,Violet,Yellow,Orange,Coral,Bronze,Copper,Brown,Beige,Cream,Titanium,Natural Titanium,Desert Titanium,Blue Titanium,Teal,Turquoise,Cyan,Magenta,Lime,Aurora,Cosmic Orange,Phantom Black,Iceberg Blue".split(",");
const badge = s => s ? `<span class="b b-${s}">${ICON[s]} ${RES[s]}</span>` : "<small>—</small>";
const specs = x => [x.ram && x.ram + " GB RAM", x.rom && x.rom + " GB", x.color].filter(Boolean).join(" · ") || "—";
const copy = t => { try { navigator.clipboard.writeText(t); } catch {} };
function toast(m, ok) { const e = document.createElement("div"); e.className = "toast" + (ok ? " ok" : ""); e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 3200); }
const modal = h => { closeModal(); const m = document.createElement("div"); m.id = "modal"; m.className = "ov"; m.onclick = e => e.target === m && closeModal(); m.innerHTML = `<div class="box">${h}</div>`; document.body.appendChild(m); };
const closeModal = () => { const m = $("modal"); if (m) m.remove(); };
// session is refreshed automatically: no forced logout, several devices at once
async function api(path, opts = {}) {
  const call = async () => { const { data } = await sb.auth.getSession(); if (!data.session) throw new Error("Session ended");
    return fetch(API + path, { ...opts, headers: { "Content-Type": "application/json", Authorization: "Bearer " + data.session.access_token } }); };
  let r = await call();
  if (r.status === 401) { await sb.auth.refreshSession(); r = await call(); if (r.status === 401) { await sb.auth.signOut(); throw new Error("Session expired"); } }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof j.detail === "string" ? j.detail : Array.isArray(j.detail) ? j.detail.map(x => x.msg.replace("Value error, ", "")).join("; ") : "Request failed");
  return j;
}
function toggleTheme() { const t = document.documentElement.dataset.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme = t; try { localStorage.setItem("theme", t); } catch {} }
document.documentElement.dataset.theme = localStorage.getItem("theme") || "dark";

// ---------- camera barcode scan (BarcodeDetector, ZXing fallback) + USB scanner support ----------
let stream, scanning = false, zx = null;
function stopScan() { scanning = false; if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; if (zx) { try { zx.reset(); } catch {} zx = null; } const o = $("scan"); if (o) o.remove(); }
const cleanScan = (id, v) => { v = String(v).trim(); if (/imei/.test(id)) { const d = v.replace(/\D/g, ""), m = d.match(/\d{15}/); return m ? m[0] : d; } return v.replace(/\s+/g, ""); };
async function scan(id, then) { stopScan(); const o = document.createElement("div"); o.id = "scan"; o.className = "ov";
  o.innerHTML = `<video id="vid" playsinline muted autoplay></video><small>Point the camera at the barcode</small><button class="pill w" onclick="stopScan()">{{x}} Cancel</button>`; document.body.appendChild(o);
  const done = raw => { const v = cleanScan(id, raw); if (!v) return; if (navigator.vibrate) navigator.vibrate(80); stopScan(); $(id).value = v; if (then) then(); };
  try {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) throw new Error("camera needs HTTPS");
    if ("BarcodeDetector" in window) { const det = new BarcodeDetector();
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } });
      const v = $("vid"); v.srcObject = stream; await v.play(); scanning = true;
      while (scanning) { const r = await det.detect(v).catch(() => []); if (r.length) return done(r[0].rawValue); await new Promise(r => setTimeout(r, 150)); }
    } else if (window.ZXing) { zx = new ZXing.BrowserMultiFormatReader(); await zx.decodeFromVideoDevice(undefined, "vid", r => { if (r) done(r.getText()); }); }
    else throw new Error("scanner library not loaded");
  } catch (e) { stopScan(); toast("Camera scan failed: " + (e.message || "allow camera access") + ". Type the code or use a USB scanner."); } }
// a USB/Bluetooth scanner types the code then presses Enter: go to the next field instead of submitting the form
function scanEnter(e) { if (e.key !== "Enter") return; e.preventDefault(); const f = e.target.closest("form"), els = [...f.querySelectorAll("input:not([type=checkbox]):not([type=color]):not(:disabled),select:not(:disabled),textarea")], i = els.indexOf(e.target); if (els[i + 1]) els[i + 1].focus(); }

// ---------- auth ----------
let authed = null, session = null, page = "dash", arg = null;
async function boot(s) {
  try { if (s === undefined) { const { data } = await sb.auth.getSession(); s = data.session; }
    session = s; if (!!s === authed) return; authed = !!s; s ? shell() : login();
  } catch (e) { $("app").innerHTML = `<div class="boot">Could not start: ${esc(e.message)} <a href="">Reload</a></div>`; }
}
// calling Supabase methods inside this callback can deadlock (blank page): defer and use the session it gives us
sb.auth.onAuthStateChange((ev, s) => setTimeout(() => boot(s), 0));
function login() {
  $("app").innerHTML = `<div class="login"><form class="card lcard" onsubmit="doLogin(event)"><h1><img class="mark" src="favicon.svg" alt="">SmartStock <span>TN</span></h1><p class="mut">Stock, sales and Sajalni checks in one place.</p>
  <input id="em" type="email" placeholder="Email" autocomplete="username" required><input id="pw" type="password" placeholder="Password" autocomplete="current-password" required>
  <button class="pill" style="width:100%;margin-top:8px">Sign in</button><div id="lm"></div></form>
  <div class="stage"><div class="float"><div class="phone"><div class="f fr"><div class="scr"><div><b>NSI</b><br><small>SmartStock</small></div></div></div><div class="f bk"><i></i></div><div class="f sd sl"></div><div class="f sd sr"></div></div></div></div></div>`;
}
async function doLogin(e) { e.preventDefault(); const { error } = await sb.auth.signInWithPassword({ email: $("em").value, password: $("pw").value });
  if (error) $("lm").innerHTML = `<div class="msg">${/fetch|network/i.test(error.message) ? "Cannot reach the server. Check config.js" : "Wrong email or password"}</div>`; }

// ---------- shell ----------
const NAV = [["dash", "{{dash}}", "Dashboard"], ["stock", "{{box}}", "Stock"], ["add", "{{plus}}", "Add phone"], ["sell", "{{banknote}}", "Sell"], ["sold", "{{receipt}}", "Sold phones"], ["tasjil", "{{shield}}", "Tasjil Sajalni"], ["tools", "{{toolbox}}", "Tools"], ["repairs", "{{wrench}}", "Repairs"], ["warranty", "{{award}}", "Warranty"]];
const go = (p, a = null) => { page = p; arg = a; shell(); };
function shell() {
  $("app").innerHTML = `<div class="app"><aside class="rail"><div class="logo"><img class="mark" src="favicon.svg" alt="">SmartStock</div>${NAV.map(([k, e, l]) => `<button class="${k === page ? "on" : ""}" onclick="go('${k}')"><span>${e}</span><em>${l}</em></button>`).join("")}</aside>
  <main><div class="top"><h1>${NAV.find(n => n[0] === page)[2]}</h1><button class="ico" onclick="quick()">{{search}} Search <kbd>Ctrl K</kbd></button>
  <button class="ico bell" title="Notifications" onclick="bellOpen()">{{bell}}<i id="bellN" class="dotn"></i></button><input type="color" id="acc" title="Accent colour" oninput="setAccent(this.value)" value="${ACC}" style="width:38px;height:38px;padding:2px;margin:0"><button class="ico" onclick="toggleLang()">${LANG === "fr" ? "EN" : "FR"}</button><button class="ico" onclick="toggleTheme()">{{contrast}}</button><button class="pill g" onclick="sb.auth.signOut()">Sign out</button></div><div id="v"></div></main></div>`;
  updateBell(); if (!window.BELL || Date.now() - window.bellAt > 60000) loadBell();
  ({ dash, stock: () => list("stock"), sold: () => list("sold"), add: addPage, sell: () => sellPage(arg), tasjil: tasjilPage, tools: toolsPage, repairs: repairsPage, warranty: warrantyPage })[page]();
}
function countUp() { document.querySelectorAll("[data-n]").forEach(el => { const n = +el.dataset.n, t0 = performance.now(), f = t => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(n * (1 - (1 - p) ** 3)).toLocaleString("fr-FR"); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); }

// ---------- dashboard ----------
async function dash() { $("v").innerHTML = '<div class="bento"><div class="card sk"></div><div class="card sk"></div><div class="card sk"></div></div>';
  try { const [s, sl] = await Promise.all([api("/dashboard/summary"), api("/sales?page_size=5")]), name = (session.user.email || "").split("@")[0], tot = (s.tunisien + s.parallele) || 1;
    $("v").innerHTML = `<div class="bento"><div class="card span2 hero"><small class="mut">{{heart}} Welcome, ${esc(name)}</small><div class="big"><span data-n="${s.stock_value_tnd}">0</span> <small>TND</small></div><small class="mut">Total stock value (purchase price)</small>
    <div class="mini"><div><small>Revenue</small><b data-n="${s.revenue_tnd}">0</b></div><div><small>Margin</small><b class="up">+<span data-n="${s.gross_margin_tnd}">0</span></b></div><div><small>Sold</small><b>${s.sold}</b></div></div>
    <div class="acts"><button class="pill" onclick="go('add')">{{plus}} Add phone</button><button class="pill w" onclick="go('sell')">{{banknote}} Scan to sell</button></div><div class="orb"></div></div>
    <div class="card"><h3>Stock split</h3><div class="ring" style="--p:${Math.round(s.tunisien / tot * 100)}%"><div><b>${s.in_stock}</b><small>In stock</small></div></div><div class="leg"><span><i class="d1"></i>Tunisien ${s.tunisien}</span><span><i class="d2"></i>Parallèle ${s.parallele}</span></div></div>
    <div class="card span2"><h3>{{receipt}} Latest sales</h3><div class="scroll"><table class="tbl"><tbody>${sl.items.map((d, i) => `<tr style="animation-delay:${i * 60}ms"><td><b>${esc(d.model || "—")}</b><br><small>${esc(d.imei1 || "")}</small></td><td>${esc((d.sale || {}).client_name || "—")}</td><td class="pr"><b>${fmt((d.sale || {}).sale_price)}</b></td></tr>`).join("") || "<tr><td class='mut'>—</td></tr>"}</tbody></table></div></div>
    <div class="card"><h3>{{shield}} Sajalni</h3><div class="big" style="color:var(--${s.blocked_in_stock ? "bad" : "ok"})">${s.blocked_in_stock}</div><small class="mut">phones blocked in stock</small><br><button class="pill g" style="margin-top:10px" onclick="go('tasjil')">Review</button></div></div>`; countUp();
  } catch (e) { toast(e.message); } }

// ---------- lists (stock + sold) ----------
const L = { stock: { page: 1, q: "", cat: "", from: "", to: "" }, sold: { page: 1, q: "", from: "", to: "" } }, ROWS = {};
for (const k of ["stock", "sold"]) { try { Object.assign(L[k], JSON.parse(localStorage.getItem("L_" + k) || "{}")); } catch {} }  // saved filters
function list(kind) { const st = L[kind], sold = kind === "sold";
  $("v").innerHTML = `<div class="card"><div class="bar"><input class="grow" placeholder="Search IMEI, S/N, model…" value="${esc(st.q)}" oninput="clearTimeout(window.tq);window.tq=setTimeout(()=>{L.${kind}.q=this.value;L.${kind}.page=1;load('${kind}')},250)">
  ${sold ? "" : [["", "All types"], ["tunisien", "Tunisien"], ["parallele", "Parallèle"], ["repaired", "{{wrench}} Repaired"]].map(([c, l]) => `<button class="pill ${st.cat === c ? "on" : "g"}" onclick="L.stock.cat='${c}';L.stock.page=1;list('stock')">${l}</button>`).join("")}
  <input type="date" value="${st.from}" onchange="L.${kind}.from=this.value;L.${kind}.page=1;load('${kind}')"><input type="date" value="${st.to}" onchange="L.${kind}.to=this.value;L.${kind}.page=1;load('${kind}')">
  ${sold ? "" : `<button class="pill" onclick="go('add')">{{plus}} Add phone</button>`}</div>
  <div class="scroll"><table class="tbl"><thead><tr><th>Phone</th><th>IMEI / S/N</th><th>Type &amp; supplier</th><th>Sajalni</th><th>${sold ? "Sale" : "Price"}</th><th></th></tr></thead><tbody id="tb"><tr><td colspan="6">…</td></tr></tbody></table></div><div class="pager" id="pg"></div></div>`; load(kind); }
async function load(kind) { const st = L[kind], sold = kind === "sold", p = new URLSearchParams({ page: st.page, page_size: 10 }); try { localStorage.setItem("L_" + kind, JSON.stringify(st)); } catch {}
  if (!sold) { p.set("status", "in_stock"); if (st.cat === "repaired") p.set("is_repair", "true"); else if (st.cat) p.set("category", st.cat); }
  if (st.q) p.set("q", st.q); if (st.from) p.set("date_from", st.from); if (st.to) p.set("date_to", st.to);
  try { const r = await api((sold ? "/sales?" : "/devices?") + p), pages = Math.max(1, Math.ceil(r.total / 10)); if (st.page > pages) { st.page = pages; return load(kind); }
    ROWS[kind] = r.items; $("tb").innerHTML = r.items.map((x, i) => row(x, i, kind)).join("") || '<tr><td colspan="6"><div class="empty">{{box}}<b>Nothing here yet</b><small>Add a phone or change the filters.</small></div></td></tr>';
    $("pg").innerHTML = `<button class="pill g" ${st.page <= 1 ? "disabled" : ""} onclick="L.${kind}.page--;load('${kind}')">{{arrow_left}}</button><span>Page ${st.page} / ${pages} · ${r.total}</span><button class="pill g" ${st.page >= pages ? "disabled" : ""} onclick="L.${kind}.page++;load('${kind}')">{{arrow_right}}</button>`;
  } catch (e) { toast(e.message); } }
function row(x, i, kind) { const s = x.sale || {}, rep = !!x.is_repair, sold = kind === "sold";
  const c1 = sold ? `<b>${esc(x.model || "—")}</b><br><small>${fdate(s.sale_date)}${s.client_name ? " · {{user}} " + esc(s.client_name) : ""}</small>` : `<b>${esc(x.model || "—")}</b><br><small>${rep && x.owner_name ? "{{user}} " + esc(x.owner_name) + " · " : ""}${esc(specs(x))}</small>`;
  const c5 = sold ? `<b class="pr">${fmt(s.sale_price)}</b><br><small>Margin: ${s.sale_price != null && x.purchase_price != null ? fmt(s.sale_price - x.purchase_price) : "—"}</small>` : `<b class="pr">${fmt(x.expected_sale_price)}</b><br><small>Buy: ${fmt(x.purchase_price)}</small>`;
  const acts = sold ? `<button class="pill w" title="Receipt" onclick="receipt(${i})">{{receipt}}</button><button class="ico" title="Edit Sajalni status" onclick="editSaj(${i})">{{shield}}</button><button class="ico" title="History" onclick="hist('${x.id}')">{{clock}}</button><button class="ico" title="Return / defective" onclick="statusForm('${x.id}')">{{undo}}</button>`
    : `${`<button class="pill w" title="Sell" onclick="go('sell','${esc(x.imei1 || x.serial_number || "")}')">{{banknote}}</button>`}<button class="ico" onclick="readDev(${i})">{{eye}}</button><button class="ico" onclick="editDev(${i})">{{pencil}}</button><button class="ico" title="History" onclick="hist('${x.id}')">{{clock}}</button><button class="ico" title="Status" onclick="statusForm('${x.id}')">{{sliders}}</button><button class="ico" onclick="delDev(${i})">{{trash}}</button>`;
  return `<tr style="animation-delay:${i * 40}ms"><td>${c1}</td><td><code>${esc(x.imei1 || "—")}</code><br><small>S/N ${esc(x.serial_number || "—")}</small></td><td><b class="t-${x.category}">${CAT[x.category]}</b><br><small>${rep ? "{{wrench}} Repaired" : esc(x.supplier_name || "—")}</small></td><td>${rep ? "<small>—</small>" : badge(x.sajalni_status)}</td><td>${c5}</td><td><div class="acts">${acts}</div></td></tr>`; }
const readDev = i => { const x = ROWS.stock[i]; modal(`<h3>${esc(x.model || "—")}</h3><dl>${[["Owner", x.owner_name], ["Color", x.color], ["RAM / ROM", (x.ram || "—") + " / " + (x.rom || "—") + " GB"], ["IMEI 2", x.imei2], ["S/N", x.serial_number], ["Supplier", x.supplier_name], ["Purchase", fmt(x.purchase_price)], ["Expected", fmt(x.expected_sale_price)], ["Sajalni", SAJ[x.sajalni_status]], ["Notes", x.notes]].filter(([k, v]) => k !== "Owner" || v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v || "—")}</dd>`).join("")}</dl><button class="pill g" onclick="closeModal()">Close</button>`); };
const editDev = i => { modal(`<h3>Edit phone</h3>${formHtml(ROWS.stock[i])}`); toggleRepair(); };
async function delDev(i) { const x = ROWS.stock[i]; if (!confirm(`Delete "${x.model || x.imei1 || "this phone"}"?`)) return; try { await api("/devices/" + x.id, { method: "DELETE" }); load("stock"); } catch (e) { toast(e.message); } }
// edit the Sajalni status of a SOLD phone (only this field)
const editSaj = i => { const x = ROWS.sold[i]; modal(`<h3>{{shield}} ${esc(x.model || "—")}</h3><small>Sajalni status</small><select id="ss"><option value="">Not checked</option>${Object.entries(SAJ).map(([k, v]) => `<option value="${k}" ${x.sajalni_status === k ? "selected" : ""}>${v}</option>`).join("")}</select><button class="pill" onclick="saveSaj('${x.id}')">Save</button>`); };
async function saveSaj(id) { try { await api(`/devices/${id}/sajalni`, { method: "PATCH", body: JSON.stringify({ sajalni_status: $("ss").value || null }) }); closeModal(); toast("Saved", true); load("sold"); } catch (e) { toast(e.message); } }

// ---------- add / edit phone (with "Repaired phone" option) ----------
function formHtml(d = {}) { const rep = !!d.is_repair, v = k => esc(d[k] ?? ""), opt = (a, sel) => a.map(x => `<option value="${x}" ${sel == x ? "selected" : ""}>${x} GB</option>`).join("");
  const fld = (k, ph, sc) => `<div class="row"><input id="${k}" placeholder="${ph}" value="${v(k)}" ${/imei/.test(k) ? 'inputmode="numeric"' : ""}>${sc ? `<button type="button" class="ico" onclick="scan('${k}')">{{camera}}</button>` : ""}</div>`;
  return `<form class="grid2" onsubmit="saveForm(event,'${d.id || ""}')" onkeydown="if(event.target.tagName==='INPUT')scanEnter(event)">
  <label class="full chk"><input type="checkbox" id="is_repair" ${rep ? "checked" : ""} onchange="toggleRepair()"> Repaired phone (owner never collected it, it will be sold)</label>
  <div class="full" id="ownw" style="display:${rep ? "block" : "none"}"><input id="owner_name" placeholder="Owner name" value="${v("owner_name")}"></div>
  <small class="full mut" id="rh" style="display:none">IMEI 1, IMEI 2 and Serial Number are optional for repaired phones.</small>
  <select class="full" id="category"><option value="tunisien">Smartphone Tunisien</option><option value="parallele" ${d.category === "parallele" ? "selected" : ""}>Smartphone Parallèle</option></select>
  ${fld("imei1", "IMEI 1 (15 digits)", 1)}${fld("imei2", "IMEI 2 (optional)", 1)}<div class="full">${fld("serial_number", "Serial Number", 1)}</div>${fld("model", "Model")}${fld("supplier_name", "Supplier")}
  <div class="row"><div><input id="color" list="colors" placeholder="Color (pick or type)" value="${v("color")}"><datalist id="colors">${COLORS.map(c => `<option value="${c}">`).join("")}</datalist></div><input type="color" title="Pick any color" onchange="$('color').value=this.value"></div>
  <div class="row"><select id="ram"><option value="">RAM</option>${opt([2, 3, 4, 6, 8, 12, 16], d.ram)}</select><select id="rom"><option value="">ROM</option>${opt([32, 64, 128, 256, 512], d.rom)}</select></div>
  <input id="purchase_price" type="number" step="0.001" placeholder="Purchase price TND" value="${v("purchase_price")}"><input id="expected_sale_price" type="number" step="0.001" placeholder="Expected sale TND" value="${v("expected_sale_price")}">
  <select class="full" id="sajalni_status"><option value="">Sajalni status: not checked</option>${Object.entries(SAJ).map(([k, x]) => `<option value="${k}" ${d.sajalni_status === k ? "selected" : ""}>${x}</option>`).join("")}</select>
  <textarea class="full" id="notes" placeholder="Notes">${v("notes")}</textarea><button class="pill full">Save</button></form>`; }
function toggleRepair() { const r = $("is_repair").checked; $("ownw").style.display = r ? "block" : "none"; $("rh").style.display = r ? "block" : "none";
  for (const id of ["supplier_name", "sajalni_status"]) { $(id).disabled = r; if (r) $(id).value = ""; } }
function addPage() { $("v").innerHTML = `<div class="card" style="max-width:760px">${formHtml()}</div>`; toggleRepair(); }
async function saveForm(e, id) { e.preventDefault(); const g = k => $(k).value, n = k => g(k) === "" ? null : +g(k), rep = $("is_repair").checked;
  const body = { is_repair: rep, owner_name: rep ? g("owner_name") : "", category: g("category"), imei1: g("imei1"), imei2: g("imei2"), serial_number: g("serial_number"), model: g("model"), color: g("color"),
    ram: n("ram"), rom: n("rom"), purchase_price: n("purchase_price"), expected_sale_price: n("expected_sale_price"), notes: g("notes"), supplier_name: rep ? null : g("supplier_name"), sajalni_status: rep ? null : (g("sajalni_status") || null) };
  try { await api(id ? "/devices/" + id : "/devices", { method: id ? "PATCH" : "POST", body: JSON.stringify(body) }); toast("Saved", true); closeModal(); if (id) load("stock"); else { L.stock.cat = rep ? "repaired" : ""; go("stock"); } }
  catch (er) { toast(er.message); } }

// ---------- sell + receipt ----------
let cur = null;
function sellPage(pre) { $("v").innerHTML = `<div class="card" style="max-width:640px"><div class="row"><input id="code" placeholder="Scan or type IMEI / Serial Number" onkeydown="if(event.key==='Enter')findDev()"><button class="ico" onclick="scan('code',findDev)">{{camera}}</button></div>
  <button class="pill" style="margin-top:8px" onclick="findDev()">Find phone</button><div id="found"></div></div>`; $("code").focus(); if (pre) { $("code").value = pre; findDev(); } }
async function findDev() { try { cur = await api("/devices/lookup/" + encodeURIComponent($("code").value.trim()));
    if (cur.status === "repair") throw new Error("This phone is in the repair list, not for sale"); if (cur.status !== "in_stock") throw new Error("This phone is already sold");
    $("found").innerHTML = `<div class="found"><b>${esc(cur.model || "—")}</b> ${badge(cur.sajalni_status)}<br><small>${esc(specs(cur))} · IMEI ${esc(cur.imei1 || "—")}</small>
    <input id="price" type="number" step="0.001" placeholder="Sale price TND" value="${cur.expected_sale_price ?? ""}"><input id="client" placeholder="Client name"><button class="pill" onclick="doSell()">Confirm sale</button></div>`;
  } catch (e) { $("found").innerHTML = ""; toast(e.message); } }
async function doSell() { const price = $("price").value;
  if (["non_autorise", "bloque"].includes(cur.sajalni_status) && !confirm(`Sajalni: ${SAJ[cur.sajalni_status]}. Sell anyway?`)) return; if (!price && !confirm("No price entered. Sell anyway?")) return;
  try { await api("/sales", { method: "POST", body: JSON.stringify({ device_id: cur.id, sale_price: price ? +price : null, client_name: $("client").value }) }); toast("Sale recorded", true);
    sellPage(); const c = document.createElement("div"); c.className = "check"; c.innerHTML = "{{check}}"; document.body.appendChild(c); setTimeout(() => c.remove(), 1200); } catch (e) { toast(e.message); } }
const NSI = (sz = 34) => `<div style="text-align:center;margin-bottom:12px"><div style="font:900 ${sz}px Montserrat,Arial;letter-spacing:8px;line-height:1">NSI</div><div style="font:600 12px Montserrat,Arial;letter-spacing:2px;margin-top:6px">NIDHAL SERVICES INFORMATIQUES</div></div>`;
function printDoc(title, body, wait = 700) { const w = window.open("", "_blank"); if (!w) return toast("Allow pop-ups to print");
  w.document.write(`<!doctype html><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;900&display=swap" rel="stylesheet"><style>body{font:14px Gotham,Montserrat,Arial,sans-serif;margin:28px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:8px;text-align:left}th{width:36%}.l{border-bottom:1px solid #000;display:inline-block;width:170px}</style>${body}`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), wait); }
const addM = (d, m) => { const x = new Date(d); x.setMonth(x.getMonth() + m); return x; }, wdate = d => d.toLocaleDateString("fr-FR", { timeZone: "Africa/Tunis" });
const qrImg = t => { if (typeof qrcode === "undefined") return ""; const q = qrcode(0, "M"); q.addData(t); q.make(); return q.createDataURL(4); };
function warranty(s) { const sd = new Date(s.sale_date), end = addM(sd, 12), bat = addM(sd, 3), now = new Date(); return { end, bat, phoneOk: end > now, batOk: bat > now, dPhone: Math.ceil((end - now) / 864e5), dBat: Math.ceil((bat - now) / 864e5) }; }
function receipt(i) { const d = ROWS.sold[i], s = d.sale || {}, w = warranty(s), r = (k, v) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`,
  qr = qrImg(`NSI|IMEI:${d.imei1 || ""}|SN:${d.serial_number || ""}|SOLD:${String(s.sale_date).slice(0, 10)}|PHONE-WARRANTY:${wdate(w.end)}|BATTERY-WARRANTY:${wdate(w.bat)}`);
  printDoc("Receipt", `${NSI()}<h2 style="text-align:center;margin:0 0 4px">Receipt / Warranty</h2><p style="text-align:center">Date: ${fdate(s.sale_date)}</p>
  <table>${r("Client", s.client_name)}${r("Model", d.model)}${r("Color", d.color)}${r("RAM / ROM", (d.ram || "—") + " / " + (d.rom || "—") + " GB")}${r("IMEI 1", d.imei1)}${r("IMEI 2", d.imei2)}${r("Serial Number", d.serial_number)}
  ${r("Phone warranty (1 year)", "until " + wdate(w.end))}${r("Battery warranty (3 months)", "until " + wdate(w.bat))}<tr><th>Price</th><td>&nbsp;</td></tr></table>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:36px"><p>Seller signature: <span class="l"></span><br><br>Customer signature: <span class="l"></span></p>${qr ? `<img src="${qr}" width="120" height="120" alt="QR">` : ""}</div>`, 1000); }

// ---------- Tasjil Sajalni ----------
let TJ = { d: [], last: {}, f: "all" };
const stt = x => ((TJ.last[x.id] || {}).result_status || x.sajalni_status) || "a_verifier", grp = s => ["bloque", "non_autorise"].includes(s) ? "bloque" : s === "autorise" ? "autorise" : s === "enregistre_temporairement" ? "temp" : "a_verifier";
const openSajalni = () => window.open("https://sajalni.tn", "_blank", "noopener");
async function tasjilPage() { $("v").innerHTML = '<div class="card sk"></div>'; try { const [r, l] = await Promise.all([api("/devices?status=in_stock&category=parallele&page_size=50"), api("/tasjil/last")]); TJ.d = r.items; TJ.last = l; tjRender(); } catch (e) { toast(e.message); } }
function tjRender() { const c = k => TJ.d.filter(x => grp(stt(x)) === k).length;
  $("v").innerHTML = `<div class="bento" style="margin-bottom:14px">${[["a_verifier", "{{search}} To check"], ["autorise", "{{check_circle}} Authorised"], ["temp", "{{hourglass}} Temporarily registered"], ["bloque", "{{ban}} Blocked"]].map(([k, l]) => `<div class="card"><small class="mut">${l}</small><div class="big">${c(k)}</div></div>`).join("")}</div>
  <div class="bar"><button class="pill" onclick="openSajalni()">{{external}} Open sajalni.tn</button>${[["all", "All"], ["a_verifier", "To check"], ["autorise", "Authorised"], ["bloque", "Blocked"]].map(([k, l]) => `<button class="pill ${TJ.f === k ? "on" : "g"}" onclick="TJ.f='${k}';tjRender()">${l}</button>`).join("")}</div>
  <div class="tj">${TJ.d.map((x, i) => [x, i]).filter(([x]) => TJ.f === "all" || grp(stt(x)) === TJ.f).map(([x, i]) => `<div class="card"><div class="row"><b>${esc(x.model || "—")}</b>${badge(stt(x))}</div><small>${esc(x.supplier_name || "—")} · ${fmt(x.expected_sale_price)}</small>
  <div class="imei"><code>${esc(x.imei1 || x.serial_number || "—")}</code><button class="ico" onclick="copy('${esc(x.imei1 || "")}')">{{copy}}</button></div><small>${TJ.last[x.id] ? fdate(TJ.last[x.id].checked_at) : "—"}</small>
  <div class="acts" style="margin-top:10px"><button class="pill" onclick="checkSaj(${i})">{{external}} Check on Sajalni</button></div></div>`).join("")}</div>`; }
function checkSaj(i) { const x = TJ.d[i]; openSajalni(); copy(x.imei1 || x.serial_number || ""); toast("IMEI copied. Paste it on Sajalni, then record the result.", true);
  setTimeout(() => modal(`<h3>${esc(x.model || "—")}</h3><select id="rs">${Object.entries(RES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select><input id="rsrc" value="Official site (manual)"><input id="rmsg" placeholder="Reference / message (optional)"><button class="pill" onclick="saveCheck('${x.id}')">Record result</button>`), 400); }
async function saveCheck(id) { try { await api(`/devices/${id}/tasjil-checks`, { method: "POST", body: JSON.stringify({ result_status: $("rs").value, source: $("rsrc").value, message: $("rmsg").value }) }); closeModal(); toast("Saved", true); tasjilPage(); } catch (e) { toast(e.message); } }

// ---------- history, status change, tools (alerts, repair list, exports) ----------
const FN = { stock: "stock", sales: "ventes", tasjil: "tasjil" };
const hist = async id => { try { const h = await api(`/devices/${id}/history`); modal(`<h3>{{clock}} History</h3>${h.map(x => `<p><small>${fdate(x.at)}</small><br>${esc(x.text)}</p>`).join("")}<button class="pill g" onclick="closeModal()">Close</button>`); } catch (e) { toast(e.message); } };
const statusForm = id => modal(`<h3>{{sliders}} Change status</h3><select id="st"><option value="in_stock">Back to stock</option><option value="repair">Repair list</option><option value="defective">Defective</option></select><input id="sr" placeholder="Reason (required)"><button class="pill" onclick="saveStatus('${id}')">Save</button>`);
async function saveStatus(id) { try { await api(`/devices/${id}/status`, { method: "POST", body: JSON.stringify({ status: $("st").value, reason: $("sr").value }) }); closeModal(); toast("Saved", true); shell(); } catch (e) { toast(e.message); } }
async function toolsPage() { $("v").innerHTML = '<div class="card sk"></div>';
  try { const [a, r, d] = await Promise.all([api("/alerts?days=30"), api("/devices?status=repair&page_size=50"), api("/devices?status=defective&page_size=50")]);
    const sec = (t, arr, f) => `<h3 style="margin-top:18px">${t} (${arr.length})</h3><div class="tj">${arr.map(x => `<div class="card"><b>${esc(x.model || "—")}</b> <small>${CAT[x.category]}</small><br><code>${esc(x.imei1 || x.serial_number || "—")}</code><br><small>${f(x)}</small><div class="acts" style="margin-top:8px"><button class="ico" onclick="hist('${x.id}')">{{clock}}</button><button class="ico" onclick="statusForm('${x.id}')">{{sliders}}</button></div></div>`).join("") || '<small class="mut">Nothing here</small>'}</div>`;
    $("v").innerHTML = sec("{{search}} Parallel phones never checked", a.never, () => "") + sec("{{hourglass}} Old or unclear Sajalni checks", a.old, () => "") + sec("{{clock}} Slow movers (30+ days in stock)", a.slow, x => x.days + " days in stock")
      + sec("{{wrench}} Repair list", r.items, x => esc(x.owner_name || x.status_reason || "")) + sec("{{x_circle}} Defective", d.items, x => esc(x.status_reason || ""))
      + `<h3 style="margin-top:18px">Exports</h3><div class="acts">${["stock", "sales", "tasjil"].map(k => `<button class="pill g" onclick="exportCsv('${k}')">{{download}} ${FN[k]}.csv</button><button class="pill g" onclick="exportPrint('${k}')">{{printer}} ${FN[k]} PDF</button>`).join("")}</div>`;
  } catch (e) { toast(e.message); } }
async function exportRows(k) { const r = await api("/export/" + k); if (!r.length) throw new Error("Nothing to export"); return r; }
async function exportCsv(k) { try { const r = await exportRows(k), h = Object.keys(r[0]), q = (v, c) => /imei|serial/.test(c) && v ? `="${v}"` : `"${String(v ?? "").replace(/"/g, '""')}"`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + [h.join(","), ...r.map(x => h.map(c => q(x[c], c)).join(","))].join("\n")], { type: "text/csv" })); a.download = FN[k] + ".csv"; a.click(); } catch (e) { toast(e.message); } }
async function exportPrint(k) { try { const r = await exportRows(k), h = Object.keys(r[0]), w = window.open("", "_blank"); if (!w) return toast("Allow pop-ups to print");
  w.document.write(`<!doctype html><title>${FN[k]}</title><style>body{font:11px Arial;margin:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:3px;text-align:left}</style><h2>${FN[k]}</h2><table><tr>${h.map(c => `<th>${c}</th>`).join("")}</tr>${r.map(x => `<tr>${h.map(c => `<td>${esc(x[c])}</td>`).join("")}</tr>`).join("")}</table>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 500); } catch (e) { toast(e.message); } }

// ---------- FR / EN (main labels) ----------
const FR = { "Dashboard": "Tableau de bord", "Add phone": "Ajouter un téléphone", "Sell": "Vendre", "Sold phones": "Téléphones vendus", "Tools": "Outils", "Sign out": "Déconnexion", "Sign in": "Connexion", "Save": "Enregistrer", "Close": "Fermer",
  "Find phone": "Chercher le téléphone", "Confirm sale": "Confirmer la vente", "Phone": "Téléphone", "Price": "Prix", "Sale": "Vente", "Type & supplier": "Type et fournisseur", "Revenue": "Chiffre d'affaires", "Margin": "Marge", "Sold": "Vendus", "In stock": "En stock",
  "Stock split": "Répartition du stock", "Latest sales": "Dernières ventes", "Total stock value (purchase price)": "Valeur du stock (prix d'achat)", "phones blocked in stock": "téléphones bloqués en stock", "Review": "Examiner", "Add phone": "Ajouter un téléphone", "Scan to sell": "Scanner pour vendre",
  "All types": "Tous types", "Repaired": "Réparés", "To check": "À vérifier", "Authorised": "Autorisés", "Temporarily registered": "Enregistrés temp.", "Blocked": "Bloqués", "All": "Tous", "To check": "À vérifier", "Authorised": "Autorisés", "Blocked": "Bloqués",
  "Open sajalni.tn": "Ouvrir sajalni.tn", "Check on Sajalni": "Vérifier sur Sajalni", "Record result": "Enregistrer le résultat", "History": "Historique", "Change status": "Changer le statut", "Back to stock": "Retour en stock", "Repair list": "Liste de réparation", "Defective": "Défectueux", "Not checked": "Non vérifié",
  "Sajalni status": "Statut Sajalni", "Password": "Mot de passe", "Search…": "Rechercher…", "Model": "Modèle", "Owner name": "Nom du propriétaire", "Client name": "Nom du client", "Sale price TND": "Prix de vente TND", "Purchase price TND": "Prix d'achat TND", "Expected sale TND": "Prix de vente prévu TND", "Supplier": "Fournisseur", "Reason (required)": "Motif (obligatoire)",
  "Color (pick or type)": "Couleur (choisir ou saisir)", "Scan or type IMEI / Serial Number": "Scanner ou saisir IMEI / N° de série", "Repaired phone (owner never collected it, it will be sold)": "Téléphone réparé (le client ne l'a pas récupéré, il sera vendu)", "IMEI 1, IMEI 2 and Serial Number are optional for repaired phones.": "IMEI 1, IMEI 2 et N° de série sont facultatifs pour les téléphones réparés.", "Sajalni status: not checked": "Statut Sajalni : non vérifié" };
const RX = [[/^Welcome, (.*)$/, "Bienvenue, $1"]];
let LANG = localStorage.getItem("lang") || "en";
function tx(s) { const t = s.trim(); if (!t || LANG !== "fr") return s; if (FR[t]) return s.replace(t, FR[t]); for (const [r, v] of RX) if (r.test(t)) return s.replace(t, t.replace(r, v)); return s; }
function trNode(n) { if (n.nodeType === 3) { const v = tx(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; return; } if (n.nodeType !== 1) return;
  for (const a of ["placeholder", "title"]) if (n.hasAttribute(a)) { const v = tx(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); } n.childNodes.forEach(trNode); }
new MutationObserver(ms => { if (LANG === "fr") ms.forEach(m => m.addedNodes.forEach(trNode)); }).observe(document.body, { childList: true, subtree: true });
function toggleLang() { LANG = LANG === "fr" ? "en" : "fr"; try { localStorage.setItem("lang", LANG); } catch {} document.documentElement.lang = LANG; shell(); }
document.documentElement.lang = LANG;

// ---------- v6: repair tickets, warranty lookup, notifications, quick search, accent colour ----------
let ACC = localStorage.getItem("acc") || "#d96900";
function setAccent(c) { ACC = c; const r = document.documentElement.style; r.setProperty("--ac", c); r.setProperty("--ac2", c); try { localStorage.setItem("acc", c); } catch {} }
setAccent(ACC);
const dshort = s => s ? new Date(s).toLocaleDateString("fr-FR", { timeZone: "Africa/Tunis" }) : "—";
const RS = { received: "Received", in_repair: "In repair", ready: "Ready", delivered: "Delivered" }, RNEXT = { received: "in_repair", in_repair: "ready", ready: "delivered" }, RP = { page: 1, q: "", status: "", from: "", to: "" };
function repairsPage() {
  $("v").innerHTML = `<div class="card"><div class="bar"><input class="grow" placeholder="Search owner, phone, model, IMEI…" value="${esc(RP.q)}" oninput="clearTimeout(window.tr);window.tr=setTimeout(()=>{RP.q=this.value;RP.page=1;loadRepairs()},250)">
  <input type="date" value="${RP.from}" onchange="RP.from=this.value;RP.page=1;loadRepairs()"><input type="date" value="${RP.to}" onchange="RP.to=this.value;RP.page=1;loadRepairs()"><button class="pill" onclick="repairForm()">{{plus}} New repair</button></div>
  <div class="acts" id="rchips" style="margin-bottom:12px"></div><div class="scroll"><table class="tbl"><thead><tr><th>Owner</th><th>Phone</th><th>Repair</th><th>Price</th><th>Dates</th><th>Status</th><th></th></tr></thead><tbody id="rb"></tbody></table></div><div class="pager" id="rpg"></div></div>`; loadRepairs(); }
async function loadRepairs() { const p = new URLSearchParams({ page: RP.page, page_size: 10 }); if (RP.status) p.set("status", RP.status); if (RP.q) p.set("q", RP.q); if (RP.from) p.set("date_from", RP.from); if (RP.to) p.set("date_to", RP.to);
  try { const [r, c] = await Promise.all([api("/repairs?" + p), api("/repairs/counts")]), pages = Math.max(1, Math.ceil(r.total / 10)); if (RP.page > pages) { RP.page = pages; return loadRepairs(); }
    ROWS.repairs = r.items;
    $("rchips").innerHTML = [["", "All"], ...Object.entries(RS)].map(([k, l]) => `<button class="pill ${RP.status === k ? "on" : "g"}" onclick="RP.status='${k}';RP.page=1;loadRepairs()">${l} ${k ? c[k] || 0 : c.all || 0}</button>`).join("");
    $("rb").innerHTML = r.items.map((x, i) => `<tr style="animation-delay:${i * 40}ms"><td><b>${esc(x.owner_name)}</b><br><small>${esc(x.owner_phone || "—")}</small></td><td><b>${esc(x.model || "—")}</b><br><small>${esc(x.color || "")}${x.imei1 ? " · " + esc(x.imei1) : ""}</small></td><td>${esc(x.issue || "—")}</td>
      <td><b class="pr">${fmt(x.price)}</b></td><td><small>In: ${dshort(x.received_at)}<br>Out: ${dshort(x.delivered_at)}</small></td><td><span class="b rb-${x.status}">${RS[x.status] || x.status}</span></td>
      <td><div class="acts">${RNEXT[x.status] ? `<button class="pill w" title="Next step" onclick="repairNext('${x.id}','${RNEXT[x.status]}')">{{arrow_right}} ${RS[RNEXT[x.status]]}</button>` : ""}<button class="ico" title="Edit" onclick="repairForm(${i})">{{pencil}}</button>
      <button class="ico" title="Receipt" onclick="repairReceipt(${i})">{{receipt}}</button><button class="ico" title="WhatsApp" onclick="repairWa(${i})">{{message}}</button><button class="ico" title="Delete" onclick="repairDel('${x.id}')">{{trash}}</button></div></td></tr>`).join("")
      || '<tr><td colspan="7"><div class="empty">{{wrench}}<b>No repairs here</b><small>Add the first repair with the button above.</small></div></td></tr>';
    $("rpg").innerHTML = `<button class="pill g" ${RP.page <= 1 ? "disabled" : ""} onclick="RP.page--;loadRepairs()">{{arrow_left}}</button><span>Page ${RP.page} / ${pages} · ${r.total}</span><button class="pill g" ${RP.page >= pages ? "disabled" : ""} onclick="RP.page++;loadRepairs()">{{arrow_right}}</button>`;
  } catch (e) { toast(e.message); } }
function repairForm(i) { const x = i === undefined ? { status: "received" } : ROWS.repairs[i], today = new Date().toISOString().slice(0, 10), d = s => s ? String(s).slice(0, 10) : "";
  modal(`<h3>${x.id ? "Edit repair" : "New repair"}</h3><form class="grid2" onsubmit="saveRepair(event,'${x.id || ""}')" onkeydown="if(event.target.tagName==='INPUT')scanEnter(event)">
  <input id="r_owner" placeholder="Owner name" value="${esc(x.owner_name)}" required><input id="r_phone" placeholder="Owner phone (WhatsApp)" value="${esc(x.owner_phone)}" inputmode="tel">
  <input id="r_model" placeholder="Model" value="${esc(x.model)}"><div><input id="r_color" list="colors" placeholder="Color" value="${esc(x.color)}"><datalist id="colors">${COLORS.map(c => `<option value="${c}">`).join("")}</datalist></div>
  <div class="full row"><input id="r_imei" placeholder="IMEI (optional)" value="${esc(x.imei1)}" inputmode="numeric"><button type="button" class="ico" onclick="scan('r_imei')">{{camera}}</button></div>
  <textarea class="full" id="r_issue" placeholder="What we will repair">${esc(x.issue)}</textarea>
  <input id="r_price" type="number" step="0.001" placeholder="Repair price TND" value="${esc(x.price)}"><select id="r_status">${Object.entries(RS).map(([k, v]) => `<option value="${k}" ${x.status === k ? "selected" : ""}>${v}</option>`).join("")}</select>
  <label><small>Date received</small><input id="r_in" type="date" value="${d(x.received_at) || today}"></label><label><small>Date given to client</small><input id="r_out" type="date" value="${d(x.delivered_at)}"></label>
  <textarea class="full" id="r_notes" placeholder="Notes">${esc(x.notes)}</textarea><button class="pill full">Save</button></form>`); }
async function saveRepair(e, id) { e.preventDefault(); const g = k => $(k).value;
  const body = { owner_name: g("r_owner"), owner_phone: g("r_phone"), model: g("r_model"), color: g("r_color"), imei1: g("r_imei"), issue: g("r_issue"), price: g("r_price") === "" ? null : +g("r_price"), status: g("r_status"), notes: g("r_notes"), received_date: g("r_in"), delivered_date: g("r_out") };
  try { await api(id ? "/repairs/" + id : "/repairs", { method: id ? "PATCH" : "POST", body: JSON.stringify(body) }); closeModal(); toast("Saved", true); loadRepairs(); } catch (er) { toast(er.message); } }
async function repairNext(id, st) { try { await api(`/repairs/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: st }) }); loadRepairs(); } catch (e) { toast(e.message); } }
async function repairDel(id) { if (!confirm("Delete this repair?")) return; try { await api("/repairs/" + id, { method: "DELETE" }); loadRepairs(); } catch (e) { toast(e.message); } }
function repairReceipt(i) { const x = ROWS.repairs[i], r = (k, v) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`;
  printDoc("Repair receipt", `${NSI()}<h2 style="text-align:center;margin:0 0 4px">Repair receipt</h2><p style="text-align:center">Received: ${dshort(x.received_at)}${x.delivered_at ? " · Given to client: " + dshort(x.delivered_at) : ""}</p>
  <table>${r("Owner", x.owner_name)}${r("Phone number", x.owner_phone)}${r("Model", x.model)}${r("Color", x.color)}${r("IMEI", x.imei1)}${r("Repair", x.issue)}${r("Status", RS[x.status])}${r("Repair price", fmt(x.price))}${r("Notes", x.notes)}</table>
  <p style="margin-top:50px">Technician signature: <span class="l"></span> &nbsp; Customer signature: <span class="l"></span></p>`); }
function repairWa(i) { const x = ROWS.repairs[i]; let n = String(x.owner_phone || "").replace(/\D/g, ""); if (!n) return toast("No phone number for this owner");
  if (n.startsWith("00")) n = n.slice(2); else if (n.length === 8) n = "216" + n;
  const m = x.status === "ready" ? `Bonjour ${x.owner_name}, votre téléphone ${x.model || ""} est prêt. Prix de la réparation : ${fmt(x.price)}. NSI - Nidhal Services Informatiques` : `Bonjour ${x.owner_name}, au sujet de votre téléphone ${x.model || ""} (réparation : ${x.issue || "—"}). NSI - Nidhal Services Informatiques`;
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(m), "_blank", "noopener"); }

// ---------- warranty lookup (phone 1 year, battery 3 months) ----------
const wline = (l, end, ok, days) => `<p><b>${l}</b>: <span class="b ${ok ? "b-autorise" : "b-bloque"}">${ok ? "Active, " + days + " days left" : "Expired"}</span> <small>until ${wdate(end)}</small></p>`;
function warrantyPage() { $("v").innerHTML = `<div class="card" style="max-width:640px"><div class="row"><input id="wc" placeholder="Scan or type IMEI / Serial Number" onkeydown="if(event.key==='Enter')findWarranty()"><button class="ico" onclick="scan('wc',findWarranty)">{{camera}}</button></div>
  <button class="pill" style="margin-top:8px" onclick="findWarranty()">Check warranty</button><div id="wr"></div></div>`; $("wc").focus(); }
async function findWarranty() { try { const d = await api("/warranty/" + encodeURIComponent($("wc").value.trim())), w = warranty(d.sale);
  $("wr").innerHTML = `<div class="found"><b>${esc(d.model || "—")}</b> <small>${esc(specs(d))}</small><br><small>IMEI ${esc(d.imei1 || "—")} · Client: ${esc(d.sale.client_name || "—")} · Sold ${wdate(new Date(d.sale.sale_date))}</small>${wline("Phone (1 year)", w.end, w.phoneOk, w.dPhone)}${wline("Battery (3 months)", w.bat, w.batOk, w.dBat)}</div>`;
} catch (e) { $("wr").innerHTML = ""; toast(e.message); } }

// ---------- notification bell ----------
function updateBell() { const a = window.BELL, b = $("bellN"); if (!a || !b) return; const n = ["blocked", "never", "old", "slow", "warranty"].reduce((t, k) => t + (a[k] || []).length, 0); b.textContent = n; b.style.display = n ? "grid" : "none"; }
async function loadBell() { try { window.BELL = await api("/alerts?days=30"); window.bellAt = Date.now(); updateBell(); } catch {} }
function bellOpen() { const a = window.BELL || {};
  modal(`<h3>Notifications</h3>${[["ban", "Blocked phones in stock", a.blocked, "tasjil"], ["search", "Parallel phones never checked", a.never, "tasjil"], ["hourglass", "Old or unclear Sajalni checks", a.old, "tasjil"], ["clock", "Slow movers (30+ days)", a.slow, "tools"], ["award", "Warranties ending within 30 days", a.warranty, "warranty"]]
    .map(([n, t, arr, pg]) => `<button class="pill g" style="justify-content:space-between;width:100%;margin:4px 0" onclick="closeModal();go('${pg}')"><span>{{${n}}} ${t}</span><b>${(arr || []).length}</b></button>`).join("")}<button class="pill g" onclick="closeModal()">Close</button>`); }

// ---------- quick search (Ctrl+K) ----------
function quick() { modal(`<input id="qk" placeholder="Search a page, IMEI, model, owner…" autocomplete="off"><div id="qr"></div>`); const inp = $("qk"); inp.focus();
  const btn = (act, label, sub) => `<button class="pill g" style="justify-content:flex-start;width:100%;margin:3px 0;text-align:left" onclick="closeModal();${act}">${label}${sub ? ` <small>${esc(sub)}</small>` : ""}</button>`;
  const run = async () => { const q = inp.value.trim(); let h = NAV.filter(n => !q || n[2].toLowerCase().includes(q.toLowerCase())).map(n => btn(`go('${n[0]}')`, n[1] + " " + n[2])).join(""); $("qr").innerHTML = h;
    if (q.length >= 3 && /^[\w .+-]{1,40}$/.test(q)) { try { const [d, r] = await Promise.all([api("/devices?page_size=5&q=" + encodeURIComponent(q)), api("/repairs?page_size=5&q=" + encodeURIComponent(q))]); if (inp.value.trim() !== q) return;
      h += d.items.map(x => btn(`quickOpen('${esc(x.imei1 || x.serial_number || "")}','${x.status}')`, "{{phone}} " + esc(x.model || "—"), (x.imei1 || x.serial_number || "") + " · " + x.status)).join("");
      h += r.items.map(x => btn(`RP.q='${esc(q)}';RP.page=1;RP.status='';go('repairs')`, "{{wrench}} " + esc(x.owner_name), (x.model || "") + " · " + (RS[x.status] || ""))).join(""); $("qr").innerHTML = h; } catch {} } };
  let t; inp.oninput = () => { clearTimeout(t); t = setTimeout(run, 250); }; run(); }
function quickOpen(code, status) { const k = status === "sold" ? "sold" : "stock"; L[k].q = code; L[k].page = 1; if (k === "stock") L.stock.cat = ""; go(k); }
document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (authed) quick(); } });
Object.assign(FR, { "Repairs": "Réparations", "Warranty": "Garantie", "New repair": "Nouvelle réparation", "Owner": "Propriétaire", "Repair": "Réparation", "Dates": "Dates", "Status": "Statut", "Received": "Reçu", "In repair": "En réparation", "Ready": "Prêt", "Delivered": "Livré",
  "Check warranty": "Vérifier la garantie", "Notifications": "Notifications", "Search": "Rechercher", "Cancel": "Annuler", "Nothing here yet": "Rien pour le moment", "No repairs here": "Aucune réparation" });

boot();

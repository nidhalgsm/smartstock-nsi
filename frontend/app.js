const $ = id => document.getElementById(id), esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const fmt = n => n == null ? "—" : Number(n).toFixed(3) + " TND", fdate = s => s ? new Date(s).toLocaleString("fr-FR", { timeZone: "Africa/Tunis" }) : "—";
const SAJ = { autorise: "Autorisé", non_autorise: "Non autorisé", bloque: "Bloqué" }, RES = { ...SAJ, enregistre_temporairement: "Enregistré temporairement", a_verifier: "À vérifier", erreur: "Erreur de vérification" };
const ICON = { autorise: "✅", non_autorise: "⚠️", bloque: "⛔", enregistre_temporairement: "⏳", a_verifier: "🔎", erreur: "❗" }, CAT = { tunisien: "Tunisien", parallele: "Parallèle" };
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

// ---------- camera barcode scan ----------
let stream, scanning = false;
function stopScan() { scanning = false; if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; const o = $("scan"); if (o) o.remove(); }
async function scan(id, then) { stopScan(); const o = document.createElement("div"); o.id = "scan"; o.className = "ov"; o.innerHTML = `<video id="vid" playsinline muted></video><button class="pill w" onclick="stopScan()">✕</button>`; document.body.appendChild(o);
  try { if (!("BarcodeDetector" in window)) throw 0; const det = new BarcodeDetector(); stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    const v = $("vid"); v.srcObject = stream; await v.play(); scanning = true;
    while (scanning) { const r = await det.detect(v).catch(() => []); if (r.length) { if (navigator.vibrate) navigator.vibrate(80); stopScan(); $(id).value = r[0].rawValue.trim(); if (then) then(); return; } await new Promise(r => setTimeout(r, 200)); }
  } catch { stopScan(); toast("Camera scan needs Chrome on Android (HTTPS). Use a USB scanner or type the code."); } }

// ---------- auth ----------
let authed = null, session = null, page = "dash", arg = null;
async function boot() { const { data } = await sb.auth.getSession(); session = data.session; if (!!session === authed) return; authed = !!session; session ? shell() : login(); }
sb.auth.onAuthStateChange(() => boot());
function login() {
  $("app").innerHTML = `<div class="login"><form class="card lcard" onsubmit="doLogin(event)"><h1>📱 SmartStock <span>TN</span></h1><p class="mut">Stock, sales and Sajalni checks in one place.</p>
  <input id="em" type="email" placeholder="Email" autocomplete="username" required><input id="pw" type="password" placeholder="Password" autocomplete="current-password" required>
  <button class="pill" style="width:100%;margin-top:8px">Sign in</button><div id="lm"></div></form>
  <div class="stage"><div class="float"><div class="phone"><div class="f fr"><div class="scr"><div><b>NSI</b><br><small>SmartStock</small></div></div></div><div class="f bk"><i></i></div><div class="f sd sl"></div><div class="f sd sr"></div></div></div></div></div>`;
}
async function doLogin(e) { e.preventDefault(); const { error } = await sb.auth.signInWithPassword({ email: $("em").value, password: $("pw").value });
  if (error) $("lm").innerHTML = `<div class="msg">${/fetch|network/i.test(error.message) ? "Cannot reach the server. Check config.js" : "Wrong email or password"}</div>`; }

// ---------- shell ----------
const NAV = [["dash", "📊", "Dashboard"], ["stock", "📦", "Stock"], ["add", "➕", "Add phone"], ["sell", "💰", "Sell"], ["sold", "🧾", "Sold phones"], ["tasjil", "🛡️", "Tasjil Sajalni"], ["tools", "🧰", "Tools"]];
const go = (p, a = null) => { page = p; arg = a; shell(); };
function shell() {
  $("app").innerHTML = `<div class="app"><aside class="rail"><div class="logo">📱 SmartStock</div>${NAV.map(([k, e, l]) => `<button class="${k === page ? "on" : ""}" onclick="go('${k}')"><span>${e}</span><em>${l}</em></button>`).join("")}</aside>
  <main><div class="top"><h1>${NAV.find(n => n[0] === page)[2]}</h1><input placeholder="Search…" onkeydown="if(event.key==='Enter'&&this.value){L.stock.q=this.value;L.stock.page=1;L.stock.cat='';go('stock')}">
  <button class="ico" onclick="toggleLang()">${LANG === "fr" ? "EN" : "FR"}</button><button class="ico" onclick="toggleTheme()">◐</button><button class="pill g" onclick="sb.auth.signOut()">Sign out</button></div><div id="v"></div></main></div>`;
  ({ dash, stock: () => list("stock"), sold: () => list("sold"), add: addPage, sell: () => sellPage(arg), tasjil: tasjilPage, tools: toolsPage })[page]();
}
function countUp() { document.querySelectorAll("[data-n]").forEach(el => { const n = +el.dataset.n, t0 = performance.now(), f = t => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(n * (1 - (1 - p) ** 3)).toLocaleString("fr-FR"); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); }

// ---------- dashboard ----------
async function dash() { $("v").innerHTML = '<div class="bento"><div class="card sk"></div><div class="card sk"></div><div class="card sk"></div></div>';
  try { const [s, sl] = await Promise.all([api("/dashboard/summary"), api("/sales?page_size=5")]), name = (session.user.email || "").split("@")[0], tot = (s.tunisien + s.parallele) || 1;
    $("v").innerHTML = `<div class="bento"><div class="card span2 hero"><small class="mut">👋 Welcome, ${esc(name)}</small><div class="big"><span data-n="${s.stock_value_tnd}">0</span> <small>TND</small></div><small class="mut">Total stock value (purchase price)</small>
    <div class="mini"><div><small>Revenue</small><b data-n="${s.revenue_tnd}">0</b></div><div><small>Margin</small><b class="up">+<span data-n="${s.gross_margin_tnd}">0</span></b></div><div><small>Sold</small><b>${s.sold}</b></div></div>
    <div class="acts"><button class="pill" onclick="go('add')">➕ Add phone</button><button class="pill w" onclick="go('sell')">💰 Scan to sell</button></div><div class="orb"></div></div>
    <div class="card"><h3>Stock split</h3><div class="ring" style="--p:${Math.round(s.tunisien / tot * 100)}%"><div><b>${s.in_stock}</b><small>In stock</small></div></div><div class="leg"><span><i class="d1"></i>Tunisien ${s.tunisien}</span><span><i class="d2"></i>Parallèle ${s.parallele}</span></div></div>
    <div class="card span2"><h3>🧾 Latest sales</h3><div class="scroll"><table class="tbl"><tbody>${sl.items.map((d, i) => `<tr style="animation-delay:${i * 60}ms"><td><b>${esc(d.model || "—")}</b><br><small>${esc(d.imei1 || "")}</small></td><td>${esc((d.sale || {}).client_name || "—")}</td><td class="pr"><b>${fmt((d.sale || {}).sale_price)}</b></td></tr>`).join("") || "<tr><td class='mut'>—</td></tr>"}</tbody></table></div></div>
    <div class="card"><h3>🛡️ Sajalni</h3><div class="big" style="color:var(--${s.blocked_in_stock ? "bad" : "ok"})">${s.blocked_in_stock}</div><small class="mut">phones blocked in stock</small><br><button class="pill g" style="margin-top:10px" onclick="go('tasjil')">Review</button></div></div>`; countUp();
  } catch (e) { toast(e.message); } }

// ---------- lists (stock + sold) ----------
const L = { stock: { page: 1, q: "", cat: "", from: "", to: "" }, sold: { page: 1, q: "", from: "", to: "" } }, ROWS = {};
function list(kind) { const st = L[kind], sold = kind === "sold";
  $("v").innerHTML = `<div class="card"><div class="bar"><input class="grow" placeholder="Search IMEI, S/N, model…" value="${esc(st.q)}" oninput="clearTimeout(window.tq);window.tq=setTimeout(()=>{L.${kind}.q=this.value;L.${kind}.page=1;load('${kind}')},250)">
  ${sold ? "" : [["", "All types"], ["tunisien", "Tunisien"], ["parallele", "Parallèle"], ["repair", "🔧 Repaired"]].map(([c, l]) => `<button class="pill ${st.cat === c ? "on" : "g"}" onclick="L.stock.cat='${c}';L.stock.page=1;list('stock')">${l}</button>`).join("")}
  <input type="date" value="${st.from}" onchange="L.${kind}.from=this.value;L.${kind}.page=1;load('${kind}')"><input type="date" value="${st.to}" onchange="L.${kind}.to=this.value;L.${kind}.page=1;load('${kind}')">
  ${sold ? "" : `<button class="pill" onclick="go('add')">➕ Add phone</button>`}</div>
  <div class="scroll"><table class="tbl"><thead><tr><th>Phone</th><th>IMEI / S/N</th><th>Type &amp; supplier</th><th>Sajalni</th><th>${sold ? "Sale" : "Price"}</th><th></th></tr></thead><tbody id="tb"><tr><td colspan="6">…</td></tr></tbody></table></div><div class="pager" id="pg"></div></div>`; load(kind); }
async function load(kind) { const st = L[kind], sold = kind === "sold", p = new URLSearchParams({ page: st.page, page_size: 10 });
  if (!sold) { p.set("status", st.cat === "repair" ? "repair" : "in_stock"); if (st.cat && st.cat !== "repair") p.set("category", st.cat); }
  if (st.q) p.set("q", st.q); if (st.from) p.set("date_from", st.from); if (st.to) p.set("date_to", st.to);
  try { const r = await api((sold ? "/sales?" : "/devices?") + p), pages = Math.max(1, Math.ceil(r.total / 10)); if (st.page > pages) { st.page = pages; return load(kind); }
    ROWS[kind] = r.items; $("tb").innerHTML = r.items.map((x, i) => row(x, i, kind)).join("") || '<tr><td colspan="6" class="mut">—</td></tr>';
    $("pg").innerHTML = `<button class="pill g" ${st.page <= 1 ? "disabled" : ""} onclick="L.${kind}.page--;load('${kind}')">←</button><span>Page ${st.page} / ${pages} · ${r.total}</span><button class="pill g" ${st.page >= pages ? "disabled" : ""} onclick="L.${kind}.page++;load('${kind}')">→</button>`;
  } catch (e) { toast(e.message); } }
function row(x, i, kind) { const s = x.sale || {}, rep = x.status === "repair", sold = kind === "sold";
  const c1 = sold ? `<b>${esc(x.model || "—")}</b><br><small>${fdate(s.sale_date)}${s.client_name ? " · 👤 " + esc(s.client_name) : ""}</small>` : `<b>${esc(x.model || "—")}</b><br><small>${rep && x.owner_name ? "👤 " + esc(x.owner_name) + " · " : ""}${esc(specs(x))}</small>`;
  const c5 = sold ? `<b class="pr">${fmt(s.sale_price)}</b><br><small>Margin: ${s.sale_price != null && x.purchase_price != null ? fmt(s.sale_price - x.purchase_price) : "—"}</small>` : rep ? "<small>🔧 Repair</small>" : `<b class="pr">${fmt(x.expected_sale_price)}</b><br><small>Buy: ${fmt(x.purchase_price)}</small>`;
  const acts = sold ? `<button class="pill w" title="Receipt" onclick="receipt(${i})">🧾</button><button class="ico" title="Edit Sajalni status" onclick="editSaj(${i})">🛡️</button><button class="ico" title="History" onclick="hist('${x.id}')">🕘</button><button class="ico" title="Return / defective" onclick="statusForm('${x.id}')">↩️</button>`
    : `${rep ? "" : `<button class="pill w" title="Sell" onclick="go('sell','${esc(x.imei1 || x.serial_number || "")}')">💰</button>`}<button class="ico" onclick="readDev(${i})">👁️</button><button class="ico" onclick="editDev(${i})">✏️</button><button class="ico" title="History" onclick="hist('${x.id}')">🕘</button><button class="ico" title="Status" onclick="statusForm('${x.id}')">⚙️</button><button class="ico" onclick="delDev(${i})">🗑️</button>`;
  return `<tr style="animation-delay:${i * 40}ms"><td>${c1}</td><td><code>${esc(x.imei1 || "—")}</code><br><small>S/N ${esc(x.serial_number || "—")}</small></td><td><b class="t-${x.category}">${CAT[x.category]}</b><br><small>${rep ? "🔧 Repaired" : esc(x.supplier_name || "—")}</small></td><td>${rep ? "<small>—</small>" : badge(x.sajalni_status)}</td><td>${c5}</td><td><div class="acts">${acts}</div></td></tr>`; }
const readDev = i => { const x = ROWS.stock[i]; modal(`<h3>${esc(x.model || "—")}</h3><dl>${[["Owner", x.owner_name], ["Color", x.color], ["RAM / ROM", (x.ram || "—") + " / " + (x.rom || "—") + " GB"], ["IMEI 2", x.imei2], ["S/N", x.serial_number], ["Supplier", x.supplier_name], ["Purchase", fmt(x.purchase_price)], ["Expected", fmt(x.expected_sale_price)], ["Sajalni", SAJ[x.sajalni_status]], ["Notes", x.notes]].filter(([k, v]) => k !== "Owner" || v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v || "—")}</dd>`).join("")}</dl><button class="pill g" onclick="closeModal()">Close</button>`); };
const editDev = i => { modal(`<h3>Edit phone</h3>${formHtml(ROWS.stock[i])}`); toggleRepair(); };
async function delDev(i) { const x = ROWS.stock[i]; if (!confirm(`Delete "${x.model || x.imei1 || "this phone"}"?`)) return; try { await api("/devices/" + x.id, { method: "DELETE" }); load("stock"); } catch (e) { toast(e.message); } }
// edit the Sajalni status of a SOLD phone (only this field)
const editSaj = i => { const x = ROWS.sold[i]; modal(`<h3>🛡️ ${esc(x.model || "—")}</h3><small>Sajalni status</small><select id="ss"><option value="">Not checked</option>${Object.entries(SAJ).map(([k, v]) => `<option value="${k}" ${x.sajalni_status === k ? "selected" : ""}>${v}</option>`).join("")}</select><button class="pill" onclick="saveSaj('${x.id}')">Save</button>`); };
async function saveSaj(id) { try { await api(`/devices/${id}/sajalni`, { method: "PATCH", body: JSON.stringify({ sajalni_status: $("ss").value || null }) }); closeModal(); toast("Saved", true); load("sold"); } catch (e) { toast(e.message); } }

// ---------- add / edit phone (with "Repaired phone" option) ----------
function formHtml(d = {}) { const rep = !!d.is_repair, v = k => esc(d[k] ?? ""), opt = (a, sel) => a.map(x => `<option value="${x}" ${sel == x ? "selected" : ""}>${x} GB</option>`).join("");
  const fld = (k, ph, sc) => `<div class="row"><input id="${k}" placeholder="${ph}" value="${v(k)}" ${/imei/.test(k) ? 'inputmode="numeric"' : ""}>${sc ? `<button type="button" class="ico" onclick="scan('${k}')">📷</button>` : ""}</div>`;
  return `<form class="grid2" onsubmit="saveForm(event,'${d.id || ""}')">
  <label class="full chk"><input type="checkbox" id="is_repair" ${rep ? "checked" : ""} onchange="toggleRepair()"> 🔧 Repaired phone (a customer's phone, not for sale)</label>
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
  try { await api(id ? "/devices/" + id : "/devices", { method: id ? "PATCH" : "POST", body: JSON.stringify(body) }); toast("Saved", true); closeModal(); if (id) load("stock"); else { L.stock.cat = rep ? "repair" : ""; go("stock"); } }
  catch (er) { toast(er.message); } }

// ---------- sell + receipt ----------
let cur = null;
function sellPage(pre) { $("v").innerHTML = `<div class="card" style="max-width:640px"><div class="row"><input id="code" placeholder="Scan or type IMEI / Serial Number" onkeydown="if(event.key==='Enter')findDev()"><button class="ico" onclick="scan('code',findDev)">📷</button></div>
  <button class="pill" style="margin-top:8px" onclick="findDev()">Find phone</button><div id="found"></div></div>`; $("code").focus(); if (pre) { $("code").value = pre; findDev(); } }
async function findDev() { try { cur = await api("/devices/lookup/" + encodeURIComponent($("code").value.trim()));
    if (cur.status === "repair") throw new Error("This phone is in the repair list, not for sale"); if (cur.status !== "in_stock") throw new Error("This phone is already sold");
    $("found").innerHTML = `<div class="found"><b>${esc(cur.model || "—")}</b> ${badge(cur.sajalni_status)}<br><small>${esc(specs(cur))} · IMEI ${esc(cur.imei1 || "—")}</small>
    <input id="price" type="number" step="0.001" placeholder="Sale price TND" value="${cur.expected_sale_price ?? ""}"><input id="client" placeholder="Client name"><button class="pill" onclick="doSell()">Confirm sale</button></div>`;
  } catch (e) { $("found").innerHTML = ""; toast(e.message); } }
async function doSell() { const price = $("price").value;
  if (["non_autorise", "bloque"].includes(cur.sajalni_status) && !confirm(`Sajalni: ${SAJ[cur.sajalni_status]}. Sell anyway?`)) return; if (!price && !confirm("No price entered. Sell anyway?")) return;
  try { await api("/sales", { method: "POST", body: JSON.stringify({ device_id: cur.id, sale_price: price ? +price : null, client_name: $("client").value }) }); toast("Sale recorded", true);
    sellPage(); const c = document.createElement("div"); c.className = "check"; c.textContent = "✓"; document.body.appendChild(c); setTimeout(() => c.remove(), 1200); } catch (e) { toast(e.message); } }
function receipt(i) { const d = ROWS.sold[i], s = d.sale || {}, r = (k, v) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`, w = window.open("", "_blank"); if (!w) return toast("Allow pop-ups to print");
  w.document.write(`<!doctype html><title>Receipt</title><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;900&display=swap" rel="stylesheet"><style>body{font:15px Gotham,Montserrat,Arial,sans-serif;margin:32px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:9px;text-align:left}th{width:35%}.l{border-bottom:1px solid #000;display:inline-block;width:200px}</style>
  <div style="text-align:center;margin-bottom:18px"><div style="font:900 72px Montserrat,Arial;letter-spacing:12px;line-height:1">NSI</div><div style="font:600 15px Montserrat,Arial;letter-spacing:3px;margin-top:8px">NIDHAL SERVICES INFORMATIQUES</div></div>
  <h2 style="text-align:center;margin:0 0 4px">Receipt / Warranty</h2><p style="text-align:center">Date: ${fdate(s.sale_date)}</p>
  <table>${r("Client", s.client_name)}${r("Model", d.model)}${r("Color", d.color)}${r("RAM / ROM", (d.ram || "—") + " / " + (d.rom || "—") + " GB")}${r("IMEI 1", d.imei1)}${r("IMEI 2", d.imei2)}${r("Serial Number", d.serial_number)}<tr><th>Price</th><td>&nbsp;</td></tr></table>
  <p style="margin-top:50px">Seller signature: <span class="l"></span> &nbsp; Customer signature: <span class="l"></span></p>`); w.document.close(); w.focus(); setTimeout(() => w.print(), 700); }

// ---------- Tasjil Sajalni ----------
let TJ = { d: [], last: {}, f: "all" };
const stt = x => ((TJ.last[x.id] || {}).result_status || x.sajalni_status) || "a_verifier", grp = s => ["bloque", "non_autorise"].includes(s) ? "bloque" : s === "autorise" ? "autorise" : s === "enregistre_temporairement" ? "temp" : "a_verifier";
const openSajalni = () => window.open("https://sajalni.tn", "_blank", "noopener");
async function tasjilPage() { $("v").innerHTML = '<div class="card sk"></div>'; try { const [r, l] = await Promise.all([api("/devices?status=in_stock&category=parallele&page_size=50"), api("/tasjil/last")]); TJ.d = r.items; TJ.last = l; tjRender(); } catch (e) { toast(e.message); } }
function tjRender() { const c = k => TJ.d.filter(x => grp(stt(x)) === k).length;
  $("v").innerHTML = `<div class="bento" style="margin-bottom:14px">${[["a_verifier", "🔎 To check"], ["autorise", "✅ Authorised"], ["temp", "⏳ Temporarily registered"], ["bloque", "⛔ Blocked"]].map(([k, l]) => `<div class="card"><small class="mut">${l}</small><div class="big">${c(k)}</div></div>`).join("")}</div>
  <div class="bar"><button class="pill" onclick="openSajalni()">↗️ Open sajalni.tn</button>${[["all", "All"], ["a_verifier", "To check"], ["autorise", "Authorised"], ["bloque", "Blocked"]].map(([k, l]) => `<button class="pill ${TJ.f === k ? "on" : "g"}" onclick="TJ.f='${k}';tjRender()">${l}</button>`).join("")}</div>
  <div class="tj">${TJ.d.map((x, i) => [x, i]).filter(([x]) => TJ.f === "all" || grp(stt(x)) === TJ.f).map(([x, i]) => `<div class="card"><div class="row"><b>${esc(x.model || "—")}</b>${badge(stt(x))}</div><small>${esc(x.supplier_name || "—")} · ${fmt(x.expected_sale_price)}</small>
  <div class="imei"><code>${esc(x.imei1 || x.serial_number || "—")}</code><button class="ico" onclick="copy('${esc(x.imei1 || "")}')">📋</button></div><small>${TJ.last[x.id] ? fdate(TJ.last[x.id].checked_at) : "—"}</small>
  <div class="acts" style="margin-top:10px"><button class="pill" onclick="checkSaj(${i})">↗️ Check on Sajalni</button></div></div>`).join("")}</div>`; }
function checkSaj(i) { const x = TJ.d[i]; openSajalni(); copy(x.imei1 || x.serial_number || ""); toast("IMEI copied. Paste it on Sajalni, then record the result.", true);
  setTimeout(() => modal(`<h3>${esc(x.model || "—")}</h3><select id="rs">${Object.entries(RES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select><input id="rsrc" value="Official site (manual)"><input id="rmsg" placeholder="Reference / message (optional)"><button class="pill" onclick="saveCheck('${x.id}')">Record result</button>`), 400); }
async function saveCheck(id) { try { await api(`/devices/${id}/tasjil-checks`, { method: "POST", body: JSON.stringify({ result_status: $("rs").value, source: $("rsrc").value, message: $("rmsg").value }) }); closeModal(); toast("Saved", true); tasjilPage(); } catch (e) { toast(e.message); } }

// ---------- history, status change, tools (alerts, repair list, exports) ----------
const FN = { stock: "stock", sales: "ventes", tasjil: "tasjil" };
const hist = async id => { try { const h = await api(`/devices/${id}/history`); modal(`<h3>🕘 History</h3>${h.map(x => `<p><small>${fdate(x.at)}</small><br>${esc(x.text)}</p>`).join("")}<button class="pill g" onclick="closeModal()">Close</button>`); } catch (e) { toast(e.message); } };
const statusForm = id => modal(`<h3>⚙️ Change status</h3><select id="st"><option value="in_stock">Back to stock</option><option value="repair">Repair list</option><option value="defective">Defective</option></select><input id="sr" placeholder="Reason (required)"><button class="pill" onclick="saveStatus('${id}')">Save</button>`);
async function saveStatus(id) { try { await api(`/devices/${id}/status`, { method: "POST", body: JSON.stringify({ status: $("st").value, reason: $("sr").value }) }); closeModal(); toast("Saved", true); shell(); } catch (e) { toast(e.message); } }
async function toolsPage() { $("v").innerHTML = '<div class="card sk"></div>';
  try { const [a, r, d] = await Promise.all([api("/alerts?days=30"), api("/devices?status=repair&page_size=50"), api("/devices?status=defective&page_size=50")]);
    const sec = (t, arr, f) => `<h3 style="margin-top:18px">${t} (${arr.length})</h3><div class="tj">${arr.map(x => `<div class="card"><b>${esc(x.model || "—")}</b> <small>${CAT[x.category]}</small><br><code>${esc(x.imei1 || x.serial_number || "—")}</code><br><small>${f(x)}</small><div class="acts" style="margin-top:8px"><button class="ico" onclick="hist('${x.id}')">🕘</button><button class="ico" onclick="statusForm('${x.id}')">⚙️</button></div></div>`).join("") || '<small class="mut">Nothing here</small>'}</div>`;
    $("v").innerHTML = sec("🔎 Parallel phones never checked", a.never, () => "") + sec("⏳ Old or unclear Sajalni checks", a.old, () => "") + sec("🐌 Slow movers (30+ days in stock)", a.slow, x => x.days + " days in stock")
      + sec("🔧 Repair list", r.items, x => esc(x.owner_name || x.status_reason || "")) + sec("❌ Defective", d.items, x => esc(x.status_reason || ""))
      + `<h3 style="margin-top:18px">Exports</h3><div class="acts">${["stock", "sales", "tasjil"].map(k => `<button class="pill g" onclick="exportCsv('${k}')">⬇️ ${FN[k]}.csv</button><button class="pill g" onclick="exportPrint('${k}')">🖨️ ${FN[k]} PDF</button>`).join("")}</div>`;
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
  "Stock split": "Répartition du stock", "🧾 Latest sales": "🧾 Dernières ventes", "Total stock value (purchase price)": "Valeur du stock (prix d'achat)", "phones blocked in stock": "téléphones bloqués en stock", "Review": "Examiner", "➕ Add phone": "➕ Ajouter un téléphone", "💰 Scan to sell": "💰 Scanner pour vendre",
  "All types": "Tous types", "🔧 Repaired": "🔧 Réparés", "🔎 To check": "🔎 À vérifier", "✅ Authorised": "✅ Autorisés", "⏳ Temporarily registered": "⏳ Enregistrés temp.", "⛔ Blocked": "⛔ Bloqués", "All": "Tous", "To check": "À vérifier", "Authorised": "Autorisés", "Blocked": "Bloqués",
  "↗️ Open sajalni.tn": "↗️ Ouvrir sajalni.tn", "↗️ Check on Sajalni": "↗️ Vérifier sur Sajalni", "Record result": "Enregistrer le résultat", "🕘 History": "🕘 Historique", "⚙️ Change status": "⚙️ Changer le statut", "Back to stock": "Retour en stock", "Repair list": "Liste de réparation", "Defective": "Défectueux", "Not checked": "Non vérifié",
  "Sajalni status": "Statut Sajalni", "Password": "Mot de passe", "Search…": "Rechercher…", "Model": "Modèle", "Owner name": "Nom du propriétaire", "Client name": "Nom du client", "Sale price TND": "Prix de vente TND", "Purchase price TND": "Prix d'achat TND", "Expected sale TND": "Prix de vente prévu TND", "Supplier": "Fournisseur", "Reason (required)": "Motif (obligatoire)",
  "Color (pick or type)": "Couleur (choisir ou saisir)", "Scan or type IMEI / Serial Number": "Scanner ou saisir IMEI / N° de série", "🔧 Repaired phone (a customer's phone, not for sale)": "🔧 Téléphone réparé (appartient à un client, pas à vendre)", "IMEI 1, IMEI 2 and Serial Number are optional for repaired phones.": "IMEI 1, IMEI 2 et N° de série sont facultatifs pour les téléphones réparés.", "Sajalni status: not checked": "Statut Sajalni : non vérifié" };
const RX = [[/^👋 Welcome, (.*)$/, "👋 Bienvenue, $1"]];
let LANG = localStorage.getItem("lang") || "en";
function tx(s) { const t = s.trim(); if (!t || LANG !== "fr") return s; if (FR[t]) return s.replace(t, FR[t]); for (const [r, v] of RX) if (r.test(t)) return s.replace(t, t.replace(r, v)); return s; }
function trNode(n) { if (n.nodeType === 3) { const v = tx(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; return; } if (n.nodeType !== 1) return;
  for (const a of ["placeholder", "title"]) if (n.hasAttribute(a)) { const v = tx(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); } n.childNodes.forEach(trNode); }
new MutationObserver(ms => { if (LANG === "fr") ms.forEach(m => m.addedNodes.forEach(trNode)); }).observe(document.body, { childList: true, subtree: true });
function toggleLang() { LANG = LANG === "fr" ? "en" : "fr"; try { localStorage.setItem("lang", LANG); } catch {} document.documentElement.lang = LANG; shell(); }
document.documentElement.lang = LANG;
boot();

// Runs frontend/app.js with a fake DOM + fake API and opens every page. Run: node tools/smoke_test.js
const vm = require("vm"), fs = require("fs"), path = require("path");
const el = () => ({ innerHTML: "", style: {}, value: "", dataset: {}, checked: false, disabled: false, appendChild() {}, remove() {}, hasAttribute: () => false, focus() {} });
const els = {}; const errs = [];
Object.assign(global, {
  document: { getElementById: id => els[id] || (els[id] = el()), documentElement: { dataset: {}, lang: "" }, body: el(), createElement: () => el(), querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem() {} }, MutationObserver: class { observe() {} }, window: { open() {} }, requestAnimationFrame() {},
  supabase: { createClient: () => ({ auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange() {}, signInWithPassword: async () => ({ error: null }), signOut: async () => {}, refreshSession: async () => {} } }) },
  SUPABASE_URL: "u", SUPABASE_ANON_KEY: "k", API: "http://x", confirm: () => true });
Object.defineProperty(global, "navigator", { value: {}, configurable: true }); URL.createObjectURL = () => "";
const dev = { id: "1", model: "Galaxy", category: "parallele", imei1: "490154203237518", imei2: null, serial_number: "SN1", supplier_name: "S", color: "Black", ram: 8, rom: 128, purchase_price: 100, expected_sale_price: 150, sajalni_status: "autorise", status: "in_stock", created_at: "2026-01-01T00:00:00Z", purchase_date: "2026-01-01T00:00:00Z",
  sale: { sale_date: "2026-02-01T00:00:00Z", sale_price: 160, client_name: "Ali", seller_name: "me" } };
const fx = p => p.startsWith("/dashboard") ? { in_stock: 1, blocked_in_stock: 1, sold: 1, tunisien: 0, parallele: 1, stock_value_tnd: 100, revenue_tnd: 160, gross_margin_tnd: 60 }
  : p.startsWith("/alerts") ? { never: [dev], old: [dev], slow: [{ ...dev, days: 40 }] } : p.startsWith("/tasjil/last") ? { "1": { result_status: "autorise", checked_at: "2026-01-02T00:00:00Z", n: 2 } }
  : p.startsWith("/export") ? [{ model: "a", imei1: "1" }] : /history/.test(p) ? [{ at: "2026-01-01T00:00:00Z", text: "Added" }] : p.startsWith("/devices/lookup") ? dev : { items: [dev], total: 1 };
(async () => {
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "frontend", "app.js"), "utf8"));
  await new Promise(r => setTimeout(r, 20));
  const out = []; global.__errs = errs; global.__fx = fx;
  vm.runInThisContext(`toast = m => __errs.push(m); api = async p => __fx(p); session = { user: { email: "a@b.c" } };`);
  for (const k of ["dash", "stock", "add", "sell", "sold", "tasjil", "tools"]) { vm.runInThisContext(`page = "${k}"; shell();`); await new Promise(r => setTimeout(r, 20)); out.push(k + ":" + (els.v.innerHTML.length > 50 ? "ok" : "EMPTY")); }
  vm.runInThisContext(`toggleLang(); toggleLang(); formHtml({ is_repair: true, owner_name: "Sam" }); row(ROWS.stock[0], 0, "stock"); row(ROWS.sold[0], 0, "sold");`);
  console.log(out.join("  ")); console.log(errs.length ? "ERRORS: " + errs.join(" | ") : "SMOKE OK");
  process.exit(errs.length || out.some(x => x.includes("EMPTY")) ? 1 : 0);
})().catch(e => { console.log("CRASH", e.stack.split("\n").slice(0, 4).join("\n")); process.exit(1); });

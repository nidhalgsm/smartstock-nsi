-- Safe to re-run. Never deletes rows.
-- 1) Repair tickets (phones repaired in the shop for customers) - a NEW table, separate from stock.
create table if not exists repairs (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null, owner_phone text,
  model text, color text, imei1 text, issue text,
  price numeric(10,3), notes text,
  status text not null default 'received' check (status in ('received','in_repair','ready','delivered')),
  received_at timestamptz not null default now(),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists repairs_status_idx on repairs(status);
alter table repairs enable row level security;
-- 2) "Repaired phone" entries in Stock are phones the owner never collected: we SELL them.
--    Earlier versions parked them in status 'repair' (not sellable). Put them back in stock.
update devices set status = 'in_stock', status_reason = null where is_repair and status = 'repair' and deleted_at is null;

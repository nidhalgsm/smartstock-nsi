-- Safe to re-run. Only adds indexes and 2 read-only functions: no data is touched.
create extension if not exists pg_trgm with schema extensions;
create index if not exists devices_imei1_trgm  on devices using gin (imei1 extensions.gin_trgm_ops);
create index if not exists devices_imei2_trgm  on devices using gin (imei2 extensions.gin_trgm_ops);
create index if not exists devices_serial_trgm on devices using gin (serial_number extensions.gin_trgm_ops);
create index if not exists devices_model_trgm  on devices using gin (model extensions.gin_trgm_ops);
create index if not exists devices_supplier_trgm on devices using gin (supplier_name extensions.gin_trgm_ops);
create index if not exists devices_list_idx    on devices (status, created_at desc) where deleted_at is null;
create index if not exists devices_sold_idx    on devices (updated_at desc) where status = 'sold';
create index if not exists sales_date_idx      on sales (sale_date desc);
create index if not exists repairs_received_idx on repairs (received_at desc);
-- Dashboard numbers in ONE query instead of downloading every row
create or replace function dashboard_summary() returns json language sql stable as $$
  select json_build_object(
    'in_stock', count(*) filter (where status = 'in_stock'),
    'blocked_in_stock', count(*) filter (where status = 'in_stock' and sajalni_status = 'bloque'),
    'sold', count(*) filter (where status = 'sold'),
    'tunisien', count(*) filter (where status = 'in_stock' and category = 'tunisien'),
    'parallele', count(*) filter (where status = 'in_stock' and category = 'parallele'),
    'stock_value_tnd', coalesce(sum(purchase_price) filter (where status = 'in_stock'), 0),
    'revenue_tnd', (select coalesce(sum(sale_price), 0) from sales),
    'gross_margin_tnd', (select coalesce(sum(s.sale_price - d.purchase_price), 0) from sales s join devices d on d.id = s.device_id
                         where s.sale_price is not null and d.purchase_price is not null))
  from devices where deleted_at is null;
$$;
create or replace function tasjil_last() returns json language sql stable as $$
  select coalesce(json_object_agg(device_id, json_build_object('device_id', device_id, 'checked_at', checked_at, 'result_status', result_status, 'n', n)), '{}'::json)
  from (select distinct on (device_id) device_id, checked_at, result_status, count(*) over (partition by device_id) as n
        from tasjil_checks order by device_id, checked_at desc) t;
$$;

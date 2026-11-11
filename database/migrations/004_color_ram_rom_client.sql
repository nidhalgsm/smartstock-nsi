-- Safe to re-run. Never deletes rows.
alter table devices add column if not exists color text, add column if not exists ram smallint, add column if not exists rom smallint;
alter table sales add column if not exists client_name text;
drop function if exists sell_device(uuid, numeric, text, text);
create or replace function sell_device(p_device_id uuid, p_price numeric, p_seller text, p_notes text, p_client text)
returns uuid language plpgsql as $$
declare v_id uuid;
begin
  update devices set status='sold', updated_at=now()
   where id=p_device_id and status='in_stock' and deleted_at is null;
  if not found then raise exception 'DEVICE_NOT_AVAILABLE'; end if;
  insert into sales(device_id, sale_price, seller_name, notes, client_name)
   values (p_device_id, p_price, p_seller, p_notes, p_client) returning id into v_id;
  return v_id;
end $$;

-- Safe to re-run. Never deletes rows.
alter table devices add column if not exists sajalni_status text check (sajalni_status in ('autorise','non_autorise','bloque'));
alter table devices drop constraint if exists devices_imei1_key, drop constraint if exists devices_imei2_key, drop constraint if exists devices_serial_number_key;
create unique index if not exists devices_imei1_uq on devices(imei1) where deleted_at is null;
create unique index if not exists devices_imei2_uq on devices(imei2) where deleted_at is null;
create unique index if not exists devices_serial_uq on devices(serial_number) where deleted_at is null;

-- Safe to re-run. Never deletes rows.
alter table devices add column if not exists owner_name text, add column if not exists is_repair boolean not null default false;
do $$ declare c record; begin
  for c in select conname from pg_constraint where conrelid = 'devices'::regclass and contype = 'c'
           and pg_get_constraintdef(oid) ilike '%imei1 is not null%' loop
    execute format('alter table devices drop constraint %I', c.conname);
  end loop; end $$;

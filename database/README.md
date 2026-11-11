# Database
* Empty Supabase project -> run `01_schema_fresh_install.sql` only.
* Existing database (your case) -> run `migrations/002` ... `005` in order in the SQL Editor.
  Each file is safe to re-run and only adds/changes structure: no row is ever deleted.
* Tip: Supabase > Database > Backups (or Table editor > Export) before any migration.

-- Health check seguro para Neon
select 'ok' as ping,
       now() as server_time,
       current_database() as db,
       current_user as username,
       inet_server_addr() as server_ip,
       version() as pg_version

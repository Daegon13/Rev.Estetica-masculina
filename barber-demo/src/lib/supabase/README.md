# Supabase-ready structure

Esta carpeta queda reservada para la integración real con Supabase.

Sugerencia de evolución:
- `client.ts`: inicialización del cliente.
- `repositories/`: acceso a tablas o vistas.
- `mappers/`: adaptación entre filas de Supabase y tipos de dominio.
- `policies/` o `sql/`: notas para RLS, migraciones o RPCs.

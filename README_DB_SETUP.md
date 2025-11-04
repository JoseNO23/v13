# storiesV13 · Configuración BD (Neon + Prisma)

Este proyecto se considera PRODUCCIÓN desde el inicio (Neon con SSL).

## Requisitos
- Node 18+ y pnpm 9
- Cuenta Neon (free tier)
- macOS o Windows (Resilio Sync opcional)

## Pasos
1. `pnpm install`
2. `pnpm run setup:env` → pega tu DATABASE_URL real de Neon (ejemplo completo):
   `postgresql://USUARIO:CONTRASENA@ep-abc12345.us-east-1.aws.neon.tech/neondb?sslmode=require`
3. `pnpm run db:check` → prueba conexión
4. `pnpm run db:deploy` → aplica migraciones (NO borra datos)

## Notas de producción
- NO usar `prisma migrate reset` ni `--force`.
- SSL obligatorio en la URL (?sslmode=require).
- Para estado/backup:
  - Estado de migraciones: `pnpm run db:status`
  - Snapshot manual: `pnpm --filter @storiesv13/api prisma db pull`
- macOS/Windows: evita rutas absolutas. Resilio puede sincronizar el repo; no compartas `.env`.

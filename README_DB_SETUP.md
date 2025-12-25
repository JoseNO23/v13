# storiesV13 · Base de datos Neon + Prisma

El entorno se ejecuta directamente sobre **Neon PostgreSQL** (instancia `v13_stories-horror`) con SSL obligatorio. El objetivo es producción temprana: cada cambio debe preservar datos.

## Flujo diario en cada máquina (macOS o Windows)

1. `pnpm run setup:machine` – prepara `node_modules` según la plataforma y registra el SO actual.
2. `pnpm run env:verify` – confirma que `apps/api/.env` sigue sincronizado (mismo SHA en ambas máquinas).
3. `pnpm run db:status` – revisa si hay migraciones pendientes contra Neon.
4. `pnpm run db:gen` – regenera Prisma Client con el schema actual.

> **Nunca** uses `prisma migrate reset` en este proyecto: borra datos productivos.

## Conexión estándar

```
DATABASE_URL="postgresql://neondb_owner:npg_mHpd49CJRTeN@ep-frosty-boat-ac6v5ufu-pooler.sa-east-1.aws.neon.tech/v13_stories-horror?sslmode=require&channel_binding=require"
```

Resilio sincroniza este `.env` entre máquinas, pero continúa ignorado por git.

## Migraciones y Neon

- Para agregar nuevos modelos o columnas:
  1. Modifica `apps/api/prisma/schema.prisma`.
  2. Ejecuta **una sola vez** (preferiblemente en la máquina principal):
     - `pnpm --filter @storiesv13/api run prisma:dev --name <descripcion>`
  3. Sincroniza la migración generada con Resilio.
  4. En cada máquina (incluida producción temprana):
     - `pnpm run db:deploy`
     - `pnpm run db:status`
- Prisma Client debe regenerarse con `pnpm run db:gen` siempre que cambie el schema.

## Buenas prácticas

- Conexión siempre cifrada (`sslmode=require` y `channel_binding=require`).
- No modificar manualmente las tablas en Neon; cualquier cambio pasa por Prisma.
- Respeta el orden de scripts multiplataforma para evitar `node_modules` corruptos.

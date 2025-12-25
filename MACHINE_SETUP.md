## Configuración de máquina y flujo multiplataforma (Windows y macOS)

- Resilio NO sincroniza `node_modules`; cada SO los genera localmente.

### Cambio de Windows ↔ macOS
1. Ejecuta:
   - `pnpm run setup:machine` (borra/reinstala si cambia el SO)
2. (Opcional) Configura el store de PNPM:
   - Windows: `pnpm config set store-dir "%LOCALAPPDATA%\pnpm\store" --global`
   - macOS:   `pnpm config set store-dir "$HOME/Library/pnpm/store" --global`
   - Ver ruta actual del store: `pnpm store path`
3. Verifica `.env` replicado:
   - `pnpm run env:verify`

### DB (Neon) y Prisma
- `pnpm run db:validate`
- `pnpm run db:deploy`
- `pnpm run db:gen`
- `pnpm run db:status`

Nota: `.env` se sincroniza por Resilio pero está ignorado por git.




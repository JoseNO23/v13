# storiesV13 · Guía de Inicio (Windows y macOS)

Guía completa para iniciar el proyecto en Windows y macOS.

## 📋 Requisitos Previos

- **Node.js** (versión 18 o superior)
- **pnpm** instalado globalmente: `npm install -g pnpm@9.0.0`
- **Resilio Sync** configurado (para sincronizar `.env` entre máquinas)

## 🚀 Inicio Rápido

### Primera vez (Setup Inicial)

#### Windows (PowerShell)

```powershell
# 1. Navegar al directorio del proyecto
cd "C:\Users\josen\Resilio Sync\STORIES-V13"

# 2. Configurar la máquina (instala dependencias según el SO)
pnpm run setup:machine

# 3. Verificar variables de entorno
pnpm run env:verify

# 4. Verificar estado de la base de datos
pnpm run db:status

# 5. Generar Prisma Client
pnpm run db:gen
```

#### macOS (Terminal)

```bash
# 1. Navegar al directorio del proyecto
cd ~/path/to/STORIES-V13

# 2. Configurar la máquina (instala dependencias según el SO)
pnpm run setup:machine

# 3. Verificar variables de entorno
pnpm run env:verify

# 4. Verificar estado de la base de datos
pnpm run db:status

# 5. Generar Prisma Client
pnpm run db:gen
```

### Iniciar el Proyecto

Necesitas **dos terminales** (una para backend, otra para frontend):

#### Terminal 1: Backend (API)

**Windows (PowerShell):**
```powershell
cd "C:\Users\josen\Resilio Sync\STORIES-V13"
pnpm --filter @storiesv13/api run start:dev
```

**macOS (Terminal):**
```bash
cd ~/path/to/STORIES-V13
pnpm --filter @storiesv13/api run start:dev
```

El backend estará disponible en: **http://localhost:4000**

#### Terminal 2: Frontend (Web)

**Windows (PowerShell):**
```powershell
cd "C:\Users\josen\Resilio Sync\STORIES-V13"
pnpm --filter @storiesv13/web run dev
```

**macOS (Terminal):**
```bash
cd ~/path/to/STORIES-V13
pnpm --filter @storiesv13/web run dev
```

El frontend estará disponible en: **http://localhost:3000**

## 🔄 Cambio entre Windows ↔ macOS

Si cambias de máquina o sistema operativo:

1. **Ejecuta setup de máquina:**
   ```bash
   pnpm run setup:machine
   ```
   Esto detecta el SO y reinstala `node_modules` si es necesario.

2. **Verifica el entorno:**
   ```bash
   pnpm run env:verify
   ```

3. **Verifica la base de datos:**
   ```bash
   pnpm run db:status
   pnpm run db:gen
   ```

## 📝 Comandos Útiles

### Base de Datos

```bash
# Ver estado de migraciones
pnpm run db:status

# Aplicar migraciones pendientes
pnpm run db:deploy

# Regenerar Prisma Client (después de cambios en schema.prisma)
pnpm run db:gen

# Verificar conexión a la base de datos
pnpm run db:check
```

### Desarrollo

```bash
# Backend en modo desarrollo (con hot-reload)
pnpm --filter @storiesv13/api run start:dev

# Frontend en modo desarrollo
pnpm --filter @storiesv13/web run dev

# Compilar backend para producción
pnpm --filter @storiesv13/api run build

# Compilar frontend para producción
pnpm --filter @storiesv13/web run build
```

## 🌐 URLs del Proyecto

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Páginas disponibles:**
  - Home: http://localhost:3000
  - Registro: http://localhost:3000/auth/register
  - Login: http://localhost:3000/auth/login

## ⚠️ Notas Importantes

1. **PowerShell vs Bash:**
   - En Windows PowerShell, **NO uses `&&`** para encadenar comandos
   - Usa `;` o ejecuta los comandos por separado
   - En macOS/Unix, puedes usar `&&` normalmente

2. **Base de Datos:**
   - **NUNCA** uses `prisma migrate reset` - borra datos productivos
   - La base de datos está en Neon PostgreSQL (producción temprana)
   - Todos los cambios pasan por Prisma migrations

3. **Variables de Entorno:**
   - El archivo `.env` se sincroniza con Resilio pero está ignorado por git
   - Verifica siempre con `pnpm run env:verify` después de sincronizar

4. **node_modules:**
   - Resilio NO sincroniza `node_modules`
   - Cada máquina debe ejecutar `pnpm run setup:machine` para generarlos localmente

## 🐛 Solución de Problemas

### Error: "Connection Refused" en frontend
- Verifica que el backend esté corriendo en el puerto 4000
- Verifica que el frontend esté corriendo en el puerto 3000

### Error: "beforeExit hook" en Prisma
- Ya está corregido en el código
- Si persiste, verifica que `PrismaService` use `process.on('beforeExit')` en lugar de `$on('beforeExit')`

### Error: "Cannot find module"
- Ejecuta `pnpm run setup:machine` para reinstalar dependencias
- Verifica que estés en el directorio raíz del proyecto

### Puerto ya en uso
- Backend (4000): Cierra otros procesos usando ese puerto o cambia `PORT` en `.env`
- Frontend (3000): Next.js intentará usar otro puerto automáticamente


# storiesV13 · Autenticación por correo

## Resumen del flujo

- Registro mediante `POST /auth/register` con `{ email, password }`.
- El backend genera un token de verificacion (10 min) y un codigo de 6 digitos.
  - `http://localhost:4000/auth/verify-email?token=<TOKEN>`
- Se envia un email con el link y el codigo de verificacion.
- Verificación: `GET /auth/verify-email?token=...` marca `emailVerifiedAt` y elimina el token.
- Inicio de sesión: `POST /auth/login` devuelve un JWT HS256 firmado con la clave interna `storiesv13-dev-secret`.
- Toda la persistencia se realiza sobre Neon PostgreSQL usando Prisma.

> Autenticación social (Google OAuth) llegará en fases posteriores. El campo `googleId` ya existe para migrar sin romper datos.

## Endpoints disponibles

| Método | Ruta                     | Descripción | Body / Query |
|--------|--------------------------|-------------|--------------|
| POST   | `/auth/register`         | Alta de usuario y emisión de token de verificación | `{ email: string, password: string }` |
| GET    | `/auth/verify-email`     | Consume token de verificación | `token` en query |
| POST   | `/auth/verify-email-code` | Verifica correo con codigo | `{ email: string, code: string }` |
| POST   | `/auth/login`            | Devuelve JWT si las credenciales son correctas y el correo está verificado | `{ email: string, password: string }` |

## Respuestas destacadas

- Registro exitoso: `{ "mensaje": "Usuario registrado. ..." }`
- Verificación: `{ "mensaje": "Correo verificado correctamente. ..." }`
- Login: `{ "mensaje": "Inicio de sesión exitoso.", "token": "<JWT>", "expiraEn": "1h" }`

Los errores se devuelven con mensajes en español (`400`, `401`, `404`, `409`).

## Desarrollo local

1. **Backend** (`apps/api`):
   - `pnpm run setup:machine`
   - `pnpm run env:verify`
   - `pnpm run db:status`
   - `pnpm run db:gen`
   - `pnpm --filter @storiesv13/api run start:dev`
2. **Frontend** (`apps/web`):
   - `pnpm --filter @storiesv13/web install` (sólo si hace falta)
   - `pnpm --filter @storiesv13/web run dev`

El frontend consume la API en `http://localhost:4000` (se puede sobrescribir con `NEXT_PUBLIC_API_BASE_URL`).

## Persistencia

- Tablas: `User`, `EmailVerificationToken`, `PasswordResetToken`, `Story`, `Category`, `StoryImage`.
- Prisma Client se genera con `pnpm run db:gen` y se usa dentro de NestJS.
- Tokens de verificación y reseteo se eliminan tras su uso o al expirar, evitando acumulación en Neon.


## Verificacion por codigo

- `POST /auth/verify-email-code` con `{ email, code }`.
- El codigo es de 6 digitos y expira a los 10 minutos (igual que el link).

## SMTP (env)

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER` (opcional si el SMTP no requiere auth)
- `SMTP_PASS` (opcional si el SMTP no requiere auth)
- `SMTP_FROM`
- `API_BASE_URL` (ejemplo: `http://localhost:4000`)

## SendGrid (env)

- SENDGRID_API_KEY`r
- SENDGRID_FROM`r


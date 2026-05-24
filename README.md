# HelpDesk UTP

Proyecto final de Topicos Especiales de Ingenieria de Software II.

## Version live

- Frontend: `https://helpdesk-utp.vercel.app`
- Users API: `https://helpdesk-users.onrender.com`
- Tickets API: `https://helpdesk-tickets-jcm8.onrender.com`
- Notifications API: `https://helpdesk-notifications.onrender.com`
- Base de datos live: Supabase PostgreSQL

Nota: los servicios gratuitos de Render pueden dormir por inactividad. La primera peticion puede tardar.

## Stack

- Frontend: React + Vite
- Backend: .NET 9
- Base de datos local: PostgreSQL 15
- Orquestacion local: Docker Compose

## Estructura

```text
helpdesk-utp/
|-- backend/
|   |-- helpdesk-users/
|   |-- helpdesk-tickets/
|   `-- helpdesk-notifications/
|-- frontend/
|-- docker-compose.yml
|-- docker-compose.supabase.yml
`-- README.md
```

## Entornos

### Local completo

Usa `docker-compose.yml`.

Levanta frontend, backends y PostgreSQL local en Docker.

```powershell
docker compose up -d --build
```

URLs locales:

- Frontend Docker: `http://localhost`
- Users API: `http://localhost:5200`
- Tickets API: `http://localhost:5201`
- Notifications API: `http://localhost:5202`
- PostgreSQL: `localhost:5432`

Credenciales de PostgreSQL local:

```text
Database: helpdesk
User: postgres
Password: postgres
```

### Local contra Supabase

Usa `docker-compose.supabase.yml`.

Este modo levanta solo frontend y backends locales, pero usa la base de datos de Supabase configurada en el `.env` de la raiz.

```powershell
docker compose -f docker-compose.supabase.yml up -d --build
```

Para apagar:

```powershell
docker compose -f docker-compose.supabase.yml down
```

## Variables de entorno

### Raiz del proyecto

`.env` es local y no se sube a git. Sirve para el modo Supabase.

Plantilla:

```text
.env.example
```

### Frontend

`frontend/.env` es local y no se sube a git. Sirve cuando corres Vite en desarrollo.

Plantilla:

```text
frontend/.env.example
```

Variables esperadas:

```env
VITE_USERS_API_URL=http://localhost:5200
VITE_TICKETS_API_URL=http://localhost:5201
VITE_NOTIFICATIONS_API_URL=http://localhost:5202
VITE_API_TIMEOUT_MS=10000
VITE_API_RETRY_DELAY_MS=5000
```

En Vercel, el frontend debe usar rutas relativas para mantener la autenticacion por cookie `HttpOnly` en el mismo origen:

```env
VITE_USERS_API_URL=/users-api
VITE_TICKETS_API_URL=/tickets-api
VITE_NOTIFICATIONS_API_URL=/notifications-api
```

`frontend/vercel.json` reescribe esas rutas hacia las APIs de Render. No uses las URLs directas de Render como `VITE_*_API_URL` en Vercel, porque la cookie de sesion quedaria en un dominio distinto al de las otras APIs.

Variables requeridas en los 3 servicios de Render:

```env
Jwt__Issuer=helpdesk-utp
Jwt__Audience=helpdesk-utp
Jwt__Key=CAMBIAR_POR_UN_SECRETO_LARGO_IGUAL_EN_LOS_3_SERVICIOS
Cors__AllowedOrigins__0=https://helpdesk-utp.vercel.app
```

`Jwt__Key` debe ser el mismo valor en Users, Tickets y Notifications.

## Preparar base de datos local

La base se prepara con migraciones de Entity Framework Core.

Al arrancar `helpdesk-users`, el servicio ejecuta automaticamente:

```text
Database.Migrate()
```

La migracion inicial vive en:

```text
backend/helpdesk-users/Migrations/20260524000000_InitialHelpdeskSchema.cs
```

Esa migracion crea las tablas `users`, `tickets`, `ticket_history` y `notifications`. Despues se ejecuta un seed idempotente para crear o actualizar los usuarios de prueba.

En Docker local, PostgreSQL crea la base `helpdesk` por la variable `POSTGRES_DB`, y las migraciones crean las tablas al iniciar `helpdesk-users`.

Si quieres recrear la base local desde cero:

```powershell
docker compose down -v
docker compose up -d --build
```

En Supabase, el proyecto/base de datos debe existir previamente. Al arrancar `helpdesk-users` con la cadena de conexion de Supabase, las migraciones crean las tablas y pueblan los usuarios si la conexion tiene permisos suficientes.

Usuarios de prueba:

```text
user1@mail.com / 1234
user2@mail.com / 1234
support1@mail.com / 1234
support2@mail.com / 1234
admin1@mail.com / 1234
```

## Desarrollo frontend sin Docker

En `frontend/`:

```powershell
npm install
npm run dev
```

Frontend Vite:

```text
http://localhost:5173
```

## Observabilidad opcional

No es necesaria para correr la app.

```powershell
docker compose -f docker-compose.yml -f docker-compose.observability.yml up -d
```

Servicios:

- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Tempo: `http://localhost:3200`

## Documentacion

- [Arquitectura](docs/architecture.md)
- [API](docs/api.md)
- [Plan de documentacion tecnica](docs/documentation-plan.md)

Swagger local:

- Users API: `http://localhost:5200/swagger`
- Tickets API: `http://localhost:5201/swagger`
- Notifications API: `http://localhost:5202/swagger`

## Comandos utiles

Ver contenedores:

```powershell
docker compose ps
```

Ver logs:

```powershell
docker compose logs --no-color --tail=80
```

Reconstruir un servicio:

```powershell
docker compose up -d --build helpdesk-tickets
```

## Pendientes

Ver [roadmap tecnico](docs/roadmap.md).

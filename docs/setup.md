# Setup Local

## Local Completo

Levanta frontend, APIs y PostgreSQL local:

```powershell
docker compose up -d --build
```

URLs:

| Servicio | URL |
| --- | --- |
| Frontend Docker | `http://localhost` |
| Users API | `http://localhost:5200` |
| Tickets API | `http://localhost:5201` |
| Notifications API | `http://localhost:5202` |
| PostgreSQL | `localhost:5432` |

Credenciales PostgreSQL local:

```text
Database: helpdesk
User: postgres
Password: postgres
```

## Local Contra Supabase

Este modo levanta frontend y APIs locales usando la base configurada en `.env`.

```powershell
docker compose -f docker-compose.supabase.yml up -d --build
```

Para apagar:

```powershell
docker compose -f docker-compose.supabase.yml down
```

## Variables De Entorno

Plantillas:

- `.env.example`
- `frontend/.env.example`

Frontend local con Vite:

```env
VITE_USERS_API_URL=http://localhost:5200
VITE_TICKETS_API_URL=http://localhost:5201
VITE_NOTIFICATIONS_API_URL=http://localhost:5202
VITE_API_TIMEOUT_MS=10000
VITE_API_RETRY_DELAY_MS=5000
```

Frontend en Vercel:

```env
VITE_USERS_API_URL=/users-api
VITE_TICKETS_API_URL=/tickets-api
VITE_NOTIFICATIONS_API_URL=/notifications-api
```

Las APIs requieren valores JWT iguales entre servicios:

```env
Jwt__Issuer=helpdesk-utp
Jwt__Audience=helpdesk-utp
Jwt__Key=CAMBIAR_POR_UN_SECRETO_LARGO_IGUAL_EN_LOS_3_SERVICIOS
Cors__AllowedOrigins__0=https://helpdesk-utp.vercel.app
```

## Base De Datos

Al arrancar `helpdesk-users`, el servicio ejecuta las migraciones de Entity Framework Core y crea usuarios de prueba de forma idempotente.

Migracion inicial:

```text
backend/helpdesk-users/Migrations/20260524000000_InitialHelpdeskSchema.cs
```

Recrear base local desde cero:

```powershell
docker compose down -v
docker compose up -d --build
```

## Desarrollo Frontend Sin Docker

```powershell
cd frontend
npm install
npm run dev
```

URL:

```text
http://localhost:5173
```

## Comandos Utiles

```powershell
docker compose ps
docker compose logs --no-color --tail=80
docker compose up -d --build helpdesk-tickets
```

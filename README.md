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

Las migraciones no estan automatizadas. Despues de levantar PostgreSQL local, conectate a la base `helpdesk` y ejecuta:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS ticket_history;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'support'))
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    priority TEXT NOT NULL,
    status TEXT,
    created_by UUID NOT NULL,
    assigned_to UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT tickets_priority_check CHECK (priority IN ('low', 'medium', 'high')),
    CONSTRAINT fk_tickets_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE ticket_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_ticket_history_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ticket_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_ticket_history_ticket_id ON ticket_history(ticket_id);

INSERT INTO users (email, password, role)
VALUES
('user1@mail.com', '1234', 'user'),
('user2@mail.com', '1234', 'user'),
('support1@mail.com', '1234', 'support'),
('support2@mail.com', '1234', 'support'),
('admin1@mail.com', '1234', 'admin');
```

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
## TODO

1. Luego de cambiar un estado desde `ticketDetails`, al volver a `dashboard` hace un pequeno refresh. Tal vez sea el chip de la notificacion lo que lo provoca.
2. Falta `refreshSession()` / `authMe()` para refrescar la sesion al recargar pagina.
3. [x] JWT real implementado en backend y frontend.
4. Mensajes de errores especificos.
    - Mensajes personalizados cuando servicios down.
5. Hay duplicidad de endpoints según rol
    - Ejemplo: consultar tickets
6. las metricas de tickets podrían ser un servicio

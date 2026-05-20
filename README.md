# HelpDesk UTP

Proyecto final de Topicos Especiales de Ingenieria de Software II.

Stack principal:
- Frontend: React + Vite
- Backend: .NET 9
- Base de datos: PostgreSQL 15
- Orquestacion local: Docker Compose

## TODO

1. Luego de cambiar un estado desde `ticketDetails`, al volver a `dashboard` hace un pequeno refresh. Tal vez sea el chip de la notificacion lo que lo provoca.
2. Falta `refreshSession()` / `authMe()` para refrescar la sesion al recargar pagina.
3. El backend no esta usando JWT, está instalado en helpdesk-users
4. Mensajes de errores especificos.
    - Mensajes personalizados cuando servicios down.
5. Hay duplicidad de endpoints según rol
    - Ejemplo: consultar tickets
6. las metricas de tickets podrían ser un servicio

## Estructura

```text
helpdesk-utp/
|-- frontend/
|-- backend/
|-- docker-compose.yml
`-- README.md
```
## Requisitos previos

- Docker Desktop
- Node.js 24.x
- npm
- .NET SDK 10
- Un cliente para PostgreSQL o `psql` (OPCIONAL)

## Puertos usados

- Frontend Docker/Nginx: `80`
- Frontend Vite dev: `5173`
- Users API: `5200`
- Tickets API: `5201`
- Notifications API: `5202`
- PostgreSQL: `5432`
- Grafana opcional: `3000`
- Prometheus opcional: `9090`
- Tempo opcional: `3200`

## 1. Levantar la base de datos

Desde la raiz del proyecto:

```powershell
docker compose up -d
```

Esto levanta PostgreSQL con estos valores:

- Host: `localhost`
- Port: `5432`
- Database: `helpdesk`
- Username: `postgres`
- Password: `postgres`

Importante:
- Debes conectarte a la base de datos llamada `helpdesk`.
- Las migrations no estan funcionales para preparar la BD automaticamente.
- Por eso, la base de datos se debe crear y poblar manualmente.

## 2. Crear tablas y poblar la base de datos manualmente

Conectate a PostgreSQL asegurandote de usar la base `helpdesk`.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_role CHECK (role IN ('admin', 'user', 'support'))
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    priority TEXT,
    status TEXT,
    created_by UUID NOT NULL,
    assigned_to UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE ticket_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user
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

## 3. Levantar el backend y frontend en Docker

Desde la raiz del proyecto:

```powershell
docker compose up -d --build
```

Esto levanta:

- `db`
- `helpdesk-users`
- `helpdesk-tickets`
- `helpdesk-notifications`
- `frontend`

Si quieres reconstruir solo servicios especificos:

```powershell
docker compose up -d --build helpdesk-users helpdesk-tickets helpdesk-notifications frontend
```

## 4. Levantar el frontend en desarrollo

Si vas a correr el frontend con Vite en tu PC, en la carpeta `frontend`:

```powershell
npm i
```

Crea el archivo `.env` copiando el contenido de `.env.example`.

Contenido esperado:

```env
VITE_USERS_API_URL=http://localhost:5200
VITE_TICKETS_API_URL=http://localhost:5201
VITE_NOTIFICATIONS_API_URL=http://localhost:5202
```

Luego inicia el frontend:

```powershell
npm run dev
```

En Docker, el frontend queda disponible en `http://localhost`.

## 4.1 Observabilidad opcional

No es necesaria para correr la app. Si algun dia quieres probar Grafana, Prometheus y Tempo:

```powershell
docker compose -f docker-compose.yml -f docker-compose.observability.yml up -d
```

Servicios:

- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Tempo: `http://localhost:3200`

## 5. Orden recomendado de arranque

1. Levantar la base de datos con `docker compose up -d`
2. Conectarse a la BD `helpdesk`
3. Ejecutar manualmente el SQL para crear tablas e insertar usuarios
4. Levantar backend y frontend con `docker compose up -d --build`
5. En `frontend/`, correr `npm i`
6. Crear `frontend/.env` copiando `frontend/.env.example`
7. Correr `npm run dev`

## 6. Verificacion rapida

Cuando todo este arriba:

- Frontend Docker: `http://localhost`
- Frontend Vite dev: `http://localhost:5173`
- Users API: `http://localhost:5200`
- Tickets API: `http://localhost:5201`
- Notifications API: `http://localhost:5202`

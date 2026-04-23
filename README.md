# HelpDesk UTP

Proyecto final de Topicos Especiales de Ingenieria de Software II.

Stack principal:
- Frontend: React + Vite
- Backend: .NET 10
- Base de datos: PostgreSQL 15
- Orquestacion local: Docker Compose

## TODO

1. Luego de cambiar un estado desde `ticketDetails`, al volver a `dashboard` hace un pequeno refresh. Tal vez sea el chip de la notificacion lo que lo provoca.
2. Falta `refreshSession()` / `authMe()` para refrescar la sesion al recargar pagina.
3. El backend no esta usando JWT.
4. Mensajes de errores especificos.
    - Mensajes personalizados cuando servicios down.
5. Hay duplicidad de endpoints según rol
    - Ejemplo: consultar tickets

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

- Frontend Vite: `5173`
- Auth API: `5227`
- User API: `5200`
- Support API: `5093`
- Admin API: `5110`
- PostgreSQL: `5432`

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

## 3. Levantar el backend en Docker

El backend vive en `backend/compose.yaml` y expone cuatro servicios:

- `helpdesk-auth`
- `helpdesk-user`
- `helpdesk-support`
- `helpdesk-admin`

Desde la carpeta `backend`:

```powershell
docker compose -f compose.yaml up --build -d
```

Si quieres reconstruir solo servicios especificos:

```powershell
docker compose -f compose.yaml up --build -d helpdesk-utp-auth helpdesk-utp-user helpdesk-utp-support helpdesk-utp-admin
```

## 4. Levantar el frontend

En la carpeta `frontend`:

```powershell
npm i
```

Crea el archivo `.env` copiando el contenido de `.env.example`.

Contenido esperado:

```env
VITE_AUTH_API_URL=http://localhost:5227
VITE_USER_API_URL=http://localhost:5200
VITE_SUPPORT_API_URL=http://localhost:5093
VITE_ADMIN_API_URL=http://localhost:5110
```

Luego inicia el frontend:

```powershell
npm run dev
```

## 5. Orden recomendado de arranque

1. Levantar la base de datos con `docker compose up -d`
2. Conectarse a la BD `helpdesk`
3. Ejecutar manualmente el SQL para crear tablas e insertar usuarios
4. Levantar backend con `docker compose -f backend/compose.yaml up --build -d`
5. En `frontend/`, correr `npm i`
6. Crear `frontend/.env` copiando `frontend/.env.example`
7. Correr `npm run dev`

## 6. Verificacion rapida

Cuando todo este arriba:

- Frontend: `http://localhost:5173`
- Auth API: `http://localhost:5227`
- User API: `http://localhost:5200`
- Support API: `http://localhost:5093`
- Admin API: `http://localhost:5110`

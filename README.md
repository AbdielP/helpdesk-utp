# Proyecto Final de Tópicos Especiales de Ingeniería de Software II
Frontend React/Vite
    - Node.js 24.14.1
Backend: .Net10

## Estructura del proyecto

```
helpdesk-utp/
│
├── frontend/          # Aplicación React (Vite)
├── backend/           # API / servicios (por implementar)
├── docker-compose.yml # Servicios (PostgreSQL, etc.)
└── README.md
```

## Rutas del Frontend

- `/login`  
  Página de inicio de sesión.

- `/`  
  (main page, se podría renombrar /tickets") Lista de tickets del usuario. desde aqui un botón para /create-ticket , y click en los tickets para abrir página de detalle de los tickets /ticket/:id

- `/ticket/new`  
  Formulario para crear un nuevo ticket.

- `/ticket/:id`  
  Vista de detalle de un ticket específico.

- `/admin`  
  Panel administrativo para gestión de tickets (asignación, estado, etc).

---

## 🐳 Base de datos (Docker)

Para levantar PostgreSQL con Docker:

```
docker compose up -d
```

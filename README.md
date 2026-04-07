# Proyecto Final de Tópicos Especiales de Ingeniería de Software II
Frontend React/Vite
    - Node.js 24.14.1
    - Backend: .Net10

# TODO:
2. Sidebar y AppRouter duplican rutas -> crear menú de rutas dinámico
3. OPCIONAL, NO NECESARIO: En AuthContext.jsx, después de refresh el usuario se pierde o se asigna mal; debe cambiarse para que, si hay token en cookie, el frontend haga una petición al backend para obtener el usuario (id y role) en lugar de usar valores hardcodeados o vacíos.

# PARA INICIAR SESIÓN
1. Cualquier usuario o correo y cualquier contraseña (aún no hay backend ni validación de usuarios)

## Estructura del proyecto

```
helpdesk-utp/
│
├── frontend/          # Aplicación React (Vite)
├── backend/           # API / servicios (por implementar)
├── docker-compose.yml # Servicios (PostgreSQL, etc.)git
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

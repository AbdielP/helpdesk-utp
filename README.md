# Proyecto Final de Tópicos Especiales de Ingeniería de Software II
Frontend React/Vite
    - Node.js 24.14.1
    - Backend: .Net10

# TODO:
1. UI: 
  - Revisar filtrado de la tabla
  - User: un botón flotante para crear ticket (un acceso rapido)
  - TicketsTable: Estilos de color map pasarlos a archivo css.

## TODO de requisitos funcionales.
6. RF5. Dice que El sistema permite pasar por estados definidos y guarda historial. (BD)
7. RF6. Historial del ticket, Se visualizan fecha, usuario y acción realizada. (BD)

### Credenciales

| Rol      | Email           | Contraseña |
|----------|-----------------|------------|
| User     | user1           | 1234       |
| User     | user2           | 1234       |
| Support  | support1        | 1234       |
| Support  | support2        | 1234       |
| Admin    | admin           | 1234       |

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

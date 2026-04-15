# Proyecto Final de Tópicos Especiales de Ingeniería de Software II
Frontend React/Vite
    - Node.js 24.14.1
    - Backend: .Net10

# TODO:
1. OPCIONAL, NO NECESARIO: En AuthContext.jsx, después de refresh el usuario se pierde o se asigna mal; debe cambiarse para que, si hay token en cookie, el frontend haga una petición al backend para obtener el usuario (id y role) en lugar de usar valores hardcodeados o vacíos.
2. UI: Filtrar tickets por estado.
  - Dashboard: Los tickets cerrados se pueden consultar, pero debe verse en la UI "opaco" o "apagado"
  - TicketsTable: Estilos de color map pasarlos a archivo css.
3. Admin: 
  - Al entrar a ticket details debe mostrar Asignado: usuario del tecnico
  - Admin y support: En ticket details deben ver que usuario creó el ticket

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

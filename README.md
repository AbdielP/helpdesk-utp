# HelpDesk UTP

Sistema web de mesa de ayuda para registrar, asignar y dar seguimiento a tickets de soporte.

## Stack

| Capa | Tecnologia |
| --- | --- |
| Frontend | React + Vite |
| Backend | .NET 9 |
| Base de datos | PostgreSQL 15 / Supabase PostgreSQL |
| Tiempo real | SignalR |
| Orquestacion local | Docker Compose |
| Pruebas backend | xUnit + WebApplicationFactory |

## Servicios

| Servicio | Responsabilidad | Local |
| --- | --- | --- |
| Frontend | Interfaz React | `http://localhost` |
| Users API | Login, sesion y usuarios | `http://localhost:5200` |
| Tickets API | Tickets, asignaciones y estados | `http://localhost:5201` |
| Notifications API | Notificaciones y SignalR | `http://localhost:5202` |

## Version Live

- Frontend: `https://helpdesk-utp.vercel.app`
- Users API: `https://helpdesk-users.onrender.com`
- Tickets API: `https://helpdesk-tickets-jcm8.onrender.com`
- Notifications API: `https://helpdesk-notifications.onrender.com`

Los servicios gratuitos de Render pueden dormir por inactividad; la primera peticion puede tardar.

## Ejecutar Local

```powershell
docker compose up -d --build
```

Usuarios de prueba:

| Rol | Credenciales |
| --- | --- |
| Usuario | `user1@mail.com` / `1234` |
| Usuario | `user2@mail.com` / `1234` |
| Soporte | `support1@mail.com` / `1234` |
| Soporte | `support2@mail.com` / `1234` |
| Admin | `admin1@mail.com` / `1234` |

## Pruebas

```powershell
dotnet test backend\Helpdesk.IntegrationTests\Helpdesk.IntegrationTests.csproj
```

Las pruebas de backend cubren autenticacion, permisos por rol, tickets, asignaciones, cambios de estado y notificaciones. Usan base de datos en memoria; no modifican Supabase ni PostgreSQL local.

## Documentacion

- [Arquitectura](docs/architecture.md)
- [API](docs/api.md)
- [Setup local y variables](docs/setup.md)
- [Pruebas](docs/testing.md)
- [Observabilidad](docs/observability.md)
- [Roadmap tecnico](docs/roadmap.md)

## Estructura

```text
helpdesk-utp/
|-- backend/
|   |-- helpdesk-users/
|   |-- helpdesk-tickets/
|   |-- helpdesk-notifications/
|   `-- Helpdesk.IntegrationTests/
|-- frontend/
|-- docs/
|-- docker-compose.yml
`-- docker-compose.observability.yml
```

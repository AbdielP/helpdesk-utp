# Arquitectura

HelpDesk UTP esta organizado como una aplicacion frontend React y tres servicios backend .NET que comparten una base PostgreSQL.

## Componentes

- Frontend: React + Vite. Consume las APIs por HTTP y recibe notificaciones en tiempo real por SignalR.
- Users API: autenticacion, sesion por cookie `HttpOnly`, usuario actual y consulta de usuarios de soporte.
- Tickets API: creacion, consulta, asignacion y cambios de estado de tickets.
- Notifications API: persistencia de notificaciones, conteos no leidos y hub SignalR.
- Base de datos: PostgreSQL local en Docker o Supabase PostgreSQL en entorno live.

## Flujo local

```text
Browser
  |
  | HTTP
  v
Frontend React
  |
  | /users, /tickets, /notifications
  v
.NET APIs
  |
  | Entity Framework Core
  v
PostgreSQL
```

## Flujo live

```text
Browser
  |
  v
Vercel frontend
  |
  | rewrites /users-api, /tickets-api, /notifications-api
  v
Render APIs
  |
  v
Supabase PostgreSQL
```

## Autenticacion

El login se realiza en Users API. Si las credenciales son validas, el backend crea un JWT y lo guarda en una cookie `HttpOnly` llamada `access_token`.

Las tres APIs leen esa cookie para autenticar las peticiones. El `Jwt__Key`, `Jwt__Issuer` y `Jwt__Audience` deben coincidir entre Users, Tickets y Notifications.

## Roles

- `user`: crea tickets y consulta sus propios tickets.
- `support`: consulta tickets asignados y actualiza estados.
- `admin`: consulta usuarios de soporte, ve todos los tickets, asigna tickets y puede acceder a notificaciones de usuarios.

## Notificaciones

Tickets API publica eventos hacia Notifications API cuando se crea, asigna, cierra o cambia de estado un ticket.

Notifications API crea las notificaciones y las emite por SignalR en `/hubs/notifications`.

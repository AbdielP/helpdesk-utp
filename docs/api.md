# API

Esta documentacion resume los contratos principales actuales. En desarrollo, cada servicio tambien expone Swagger UI y OpenAPI JSON.

## Swagger local

| Servicio | Swagger UI | OpenAPI JSON |
| --- | --- | --- |
| Users API | `http://localhost:5200/swagger` | `http://localhost:5200/swagger/v1/swagger.json` |
| Tickets API | `http://localhost:5201/swagger` | `http://localhost:5201/swagger/v1/swagger.json` |
| Notifications API | `http://localhost:5202/swagger` | `http://localhost:5202/swagger/v1/swagger.json` |

## Users API

Base local: `http://localhost:5200`

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/users/login` | No | Valida credenciales, crea JWT y guarda cookie `access_token`. |
| `POST` | `/users/logout` | No | Elimina la cookie de sesion. |
| `GET` | `/users/me` | Si | Devuelve el usuario autenticado. |
| `GET` | `/users?role=support` | Admin | Lista usuarios con rol `support`. |

## Tickets API

Base local: `http://localhost:5201`

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/tickets` | Si | Lista tickets segun rol: admin ve todos, support ve asignados, user ve propios. |
| `GET` | `/tickets/{id}` | Si | Devuelve detalle, usuarios relacionados e historial. |
| `POST` | `/tickets` | User | Crea un ticket. |
| `PATCH` | `/tickets/{id}/status` | Admin/Support | Cambia el estado del ticket. |
| `PATCH` | `/tickets/{id}/assign` | Admin | Asigna el ticket a un usuario de soporte. |

## Notifications API

Base local: `http://localhost:5202`

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/notifications/user/{userId}` | Si | Lista las ultimas notificaciones de un usuario. |
| `GET` | `/notifications/user/{userId}/unread-count` | Si | Devuelve el conteo de no leidas. |
| `POST` | `/notifications` | No | Crea una notificacion directa. |
| `POST` | `/notifications/events/ticket` | No | Crea notificaciones desde eventos de tickets. |
| `PATCH` | `/notifications/{id}/read` | Si | Marca una notificacion como leida. |
| `PATCH` | `/notifications/user/{userId}/read-all` | Si | Marca todas las notificaciones del usuario como leidas. |

## SignalR

| Servicio | Ruta | Eventos |
| --- | --- | --- |
| Notifications API | `/hubs/notifications` | `NotificationReceived`, `UnreadCountChanged` |

## Automatizacion

Swagger usa los XML Comments del backend para mostrar descripciones entendibles en los endpoints y modelos.

# Plan de documentacion tecnica

La documentacion del proyecto se divide en documentacion humana y documentacion generada.

## Documentacion humana

- `README.md`: onboarding, entornos, comandos y despliegue.
- `docs/architecture.md`: componentes, comunicacion y roles.
- `docs/api.md`: resumen de contratos HTTP mientras Swagger queda como fuente navegable.
- `docs/roadmap.md`: pendientes tecnicos y siguientes mejoras.

## Backend .NET

Usar XML Comments `///` solo en controladores, DTOs y servicios donde aporten contexto real:

- proposito del endpoint o clase;
- restricciones por rol;
- reglas de negocio;
- respuestas o errores esperados cuando no sean obvios.

No comentar validaciones triviales ni codigo que se explica por el nombre.

Estado actual: los tres servicios generan archivo XML de documentacion y Swagger UI en desarrollo.

## Frontend React

Usar JSDoc solo en piezas importantes:

- hooks compartidos;
- servicios de API;
- providers;
- componentes con reglas de estado o efectos secundarios.

No documentar componentes visuales simples si el nombre y props ya son claros.

## Documentacion automatica

La automatizacion debe venir despues de tener fuentes utiles:

- Swagger/OpenAPI para APIs .NET. Estado: iniciado.
- DocFX para generar documentacion .NET desde XML Comments.
- JSDoc para generar documentacion de frontend desde comentarios JSDoc. Estado: comentarios iniciales agregados en hooks y servicios compartidos.

La siguiente prioridad es ampliar Swagger con ejemplos y respuestas esperadas donde valga la pena.

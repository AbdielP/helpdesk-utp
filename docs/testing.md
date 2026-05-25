# Pruebas

## Backend

Las pruebas de backend viven en:

```text
backend/Helpdesk.IntegrationTests
```

Usan:

- xUnit
- `Microsoft.AspNetCore.Mvc.Testing`
- `WebApplicationFactory`
- `Microsoft.EntityFrameworkCore.InMemory`

No usan Supabase ni PostgreSQL local. Cada factory crea datos en memoria durante la ejecucion de `dotnet test`.

## Ejecutar

```powershell
dotnet test backend\Helpdesk.IntegrationTests\Helpdesk.IntegrationTests.csproj
```

Estado actual:

```text
Total: 28
Correctas: 28
Errores: 0
Warnings: 0
```

## Cobertura Funcional

| API | Cobertura |
| --- | --- |
| Users API | login, cookie de sesion, usuario actual, permisos de admin |
| Tickets API | creacion, validaciones, visibilidad por rol, asignacion, cambio de estado |
| Notifications API | consulta, permisos, no leidas, creacion directa, eventos de ticket, marcar como leida |

## Pendiente

Agregar pruebas E2E frontend con Playwright para cubrir flujos completos en navegador:

- login
- crear ticket
- asignar ticket como admin
- cambiar estado como soporte

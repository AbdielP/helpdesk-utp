# Observabilidad

La observabilidad local es opcional y no es necesaria para correr la app.

## Levantar Servicios

```powershell
docker compose -f docker-compose.yml -f docker-compose.observability.yml up -d
```

## URLs

| Servicio | URL |
| --- | --- |
| Grafana | `http://localhost:3000` |
| Prometheus | `http://localhost:9090` |
| Tempo | `http://localhost:3200` |

## Archivos

```text
observability/
|-- prometheus.yaml
|-- tempo.yaml
`-- grafana/
    `-- datasources/
        `-- datasources.yaml
```

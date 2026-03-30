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

--
## 🚀 Cómo ejecutar el frontend

1. Entrar a la carpeta del frontend:

```
cd frontend
```

2. Instalar dependencias (solo la primera vez):

```
npm install
```

3. Iniciar el servidor de desarrollo:

```
npm run dev
```

4. Abrir en el navegador:

```
http://localhost:5173
```

---

## 🐳 Base de datos (Docker)

Para levantar PostgreSQL con Docker:

```
docker compose up -d
```

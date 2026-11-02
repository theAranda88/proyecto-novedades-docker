# Levantar el stack local con Docker

## Requisitos

- Docker Desktop (Windows) con Compose v2
- Puertos libres: **5432**, **3000**, **5173**

## Pasos

```bash
cd "d:/Documentos/UNIAUTONOMA/VI Semestre/Proyecto-novedades-docker"
cp .env.docker.example .env
docker compose up --build
```

Primera ejecución: el servicio `migrate` crea el esquema y datos de prueba.

## URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000/api/health |
| Swagger | http://localhost:3000/api-docs |

## Login de prueba (sin Google)

- Correo: `cristian.aranda.h@uniautonoma.edu.co`
- Contraseña: `Password123` (campo API: `password`, no `contrasena`)

## Comandos útiles

```bash
docker compose logs -f api
docker compose down
docker compose down -v   # borra volumen PostgreSQL
```

## Google / Firebase

Opcional para el primer arranque. Ver `docs/VARIABLES_ENTORNO.md`.

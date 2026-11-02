# SDD — Desarrollo guiado por especificación (Proyecto Novedades)

## 1. Fuentes de verdad

| Capa | Artefacto | Ubicación |
|------|-----------|-----------|
| Reglas de negocio | HU_DB / historias | `proyecto-novedades/src/utils/HU_DB_*`, migraciones SQL |
| Contrato HTTP | OpenAPI + Swagger | `proyecto-novedades/src/config/swagger.ts` → `/api-docs` |
| Validación entrada API | Zod | `proyecto-novedades/src/schemas/` |
| Core dominio | Servicios | `proyecto-novedades/src/services/` (especialmente `SolicitudService.ts`) |
| Persistencia | Repositories + SQL | `proyecto-novedades/src/repositories/`, `migrations/` |
| UI | Vue + servicios | `Front_Novedades/src/pages/`, `Front_Novedades/src/services/` |
| Runtime local | Docker | `docker-compose.yml`, `docs/VARIABLES_ENTORNO.md` |

## 2. Flujo de cambio (una historia)

1. **Spec**: actualizar o citar HU / regla § en comentario o doc.
2. **Datos**: migración SQL si cambia esquema (`migrations/0xx_*.sql`); en Docker fresh usar bootstrap (`docker-bootstrap-db.js`).
3. **Backend**: schema Zod → service → repository → route/controller → Swagger.
4. **Frontend**: tipos en `types/index.ts` → `*Service.ts` → página/componente.
5. **Verificación**: Postman (`postman/`), login seed, flujo en http://localhost:5173.

## 3. Mapa de módulos API

| Prefijo | Dominio |
|---------|---------|
| `/api/auth` | Login, Google, cambio contraseña |
| `/api/solicitudes` | Novedades académicas + motor validaciones |
| `/api/estudiantes` | Perfil estudiante |
| `/api/grupos` | Grupos / cupos |
| `/api/usuarios` | Admin usuarios |
| `/api/dashboard` | Métricas secretaría |
| `/api/notificaciones` | Notificaciones + orquestador WS/FCM |

## 4. Plantilla de historia (copiar por tarea)

```markdown
### HU-XXX — Título
- **Regla**: (cita HU_DB §)
- **API**: método ruta, body, respuesta
- **BD**: tablas/columnas
- **Front**: ruta Vue, store/servicio
- **Criterios de aceptación**: …
- **Prueba manual**: …
```

## 5. Entorno

Ver `docs/VARIABLES_ENTORNO.md` y `docs/LOCAL_DOCKER.md`.

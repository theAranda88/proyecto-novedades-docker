# Variables de entorno — Proyecto Novedades

## Qué necesitas para levantar **local sin Google ni Firebase**

Con Docker Compose (`docker compose up`) basta el archivo `.env` en la raíz (copia de `.env.docker.example`).  
Puedes probar login **correo + contraseña** con usuarios del seed:

| Rol | Correo (ejemplo) | Contraseña |
|-----|------------------|------------|
| Estudiante | `cristian.aranda.h@uniautonoma.edu.co` | `Password123` |
| Secretaría | Ver seed en `migrations/000_setup_completo.sql` (usuario SEC001) | `Password123` |

Google y Firebase son **opcionales** en local: la API arranca igual; FCM solo muestra advertencia en logs.

---

## Google OAuth (login con botón Google)

Mismo **Client ID** en backend y frontend (solo el ID público, nunca el Client Secret en el front).

| Variable | Dónde va | Obligatoria |
|----------|----------|-------------|
| `GOOGLE_CLIENT_ID` | Backend (`proyecto-novedades/.env` o `.env` raíz → servicio `api`) | Solo si usas login Google |
| `GOOGLE_DOMINIO_PERMITIDO` | Backend | Recomendado: `uniautonoma.edu.co` |
| `VITE_GOOGLE_CLIENT_ID` | Frontend (mismo valor que `GOOGLE_CLIENT_ID`) | Solo si usas login Google |
| `VITE_GOOGLE_HD` | Frontend | Dominio hosted domain del botón (`uniautonoma.edu.co`) |

### Dónde conseguir `GOOGLE_CLIENT_ID`

1. Entra a [Google Cloud Console](https://console.cloud.google.com/).
2. Elige el **proyecto** de la universidad (o crea uno para desarrollo).
3. **APIs y servicios** → **Credenciales**.
4. **Crear credenciales** → **ID de cliente de OAuth** → tipo **Aplicación web**.
5. Copia el valor **ID de cliente** (termina en `.apps.googleusercontent.com`).

Configura en esa credencial:

- **Orígenes JavaScript autorizados**: `http://localhost:5173` (y el puerto que uses con Vite/Docker).
- Si usas despliegue: también tu dominio HTTPS del front.

6. **APIs y servicios** → **Biblioteca** → habilita **Google Identity Services** / people API si el proyecto lo exige (GIS suele funcionar con OAuth configurado).

**Qué enviarme (sin secretos del front):** solo el `GOOGLE_CLIENT_ID` (es público). No hace falta el Client Secret para este flujo (el front envía un ID token y el backend lo verifica con `google-auth-library`).

---

## Firebase / FCM (notificaciones push móvil)

El backend usa **Firebase Admin SDK** con un archivo JSON de cuenta de servicio.

| Variable | Dónde va | Obligatoria |
|----------|----------|-------------|
| `FIREBASE_CONFIG_PATH` | Backend | Ruta al JSON dentro del contenedor/host |
| (alternativa) | Colocar archivo en `proyecto-novedades/src/services/firebase-credentials.json` | Solo local; **no subir a git** |

Variables opcionales referenciadas en código (`FCMService`): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `WEB_URL`.

### Dónde conseguir el JSON de Firebase

1. [Firebase Console](https://console.firebase.google.com/) → tu proyecto.
2. **Configuración del proyecto** (engranaje) → pestaña **Cuentas de servicio**.
3. **Firebase Admin SDK** → **Generar nueva clave privada** → descarga un `.json`.

Ese archivo contiene `project_id`, `client_email`, `private_key`, etc.

**Qué enviarme:** preferible **no** pegar el JSON completo en el chat. Mejor:

- Guarda el archivo como `proyecto-novedades/secrets/firebase-admin.json` (carpeta en `.gitignore`).
- Dime solo: `project_id` y que ya está en esa ruta; en Docker usamos volumen + `FIREBASE_CONFIG_PATH`.

En `docker-compose.yml` (cuando lo tengas):

```yaml
environment:
  FIREBASE_CONFIG_PATH: /run/secrets/firebase-admin.json
volumes:
  - ./proyecto-novedades/secrets/firebase-admin.json:/run/secrets/firebase-admin.json:ro
```

Sin ese archivo: **WebSocket + BD** siguen funcionando para notificaciones; push FCM no.

---

## Otras variables (referencia rápida)

| Variable | Uso |
|----------|-----|
| `JWT_SECRET` | Firmar JWT (mín. ~32 caracteres en prod) |
| `DB_*` / `POSTGRES_*` | PostgreSQL (Docker las define en compose) |
| `CORS_ORIGIN_DEV` | Debe coincidir con el origen del navegador (`http://localhost:5173`) |
| `STORAGE_TYPE` | `local` (default) o Cloudinary si configuras `CLOUDINARY_*` |
| `VITE_API_BASE_URL` | En dev Docker: `/api` (proxy Vite → API) |

---

## Archivos `.env` en este repo

| Archivo | Propósito |
|---------|-----------|
| `.env` (raíz) | Docker Compose — **crear desde** `.env.docker.example` |
| `proyecto-novedades/.env` | Backend fuera de Docker |
| `Front_Novedades/.env` | Frontend fuera de Docker (solo `VITE_*`) |

Nunca commitear `.env` ni JSON de Firebase.

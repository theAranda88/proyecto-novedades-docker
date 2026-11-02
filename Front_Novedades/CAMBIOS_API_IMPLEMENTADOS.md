<!-- 
═══════════════════════════════════════════════════════════════════════════════
📋 RESUMEN DE CAMBIOS IMPLEMENTADOS - INTEGRACIÓN API
═══════════════════════════════════════════════════════════════════════════════
Fecha: 3 de abril de 2026
Estado: ✅ IMPLEMENTADO SIN ROMPER NADA EXISTENTE
═══════════════════════════════════════════════════════════════════════════════
-->

# 🚀 CONFIGURACIÓN API - CAMBIOS IMPLEMENTADOS

## ✅ 1. PROTECCIÓN DE RUTAS POR ROL (PROBLEMA RESUELTO)

### Problema
- ❌ "La secretaria ve vista de estudiante"
- Las rutas `/secretaria`, `/admin` no tenían protección por rol
- Cualquier usuario autenticado podía acceder a cualquier parte

### Solución Implementada
**Archivo:** `src/router/index.ts`

```typescript
// Cada ruta ahora tiene:
meta: { requiresAuth: true, requiredRole: 'Secretaria' }
//                                           ↑ Protección por rol
```

**Rutas protegidas:**
- `/dashboard/*` → Requiere rol `'Estudiante'`
- `/secretaria/*` → Requiere rol `'Secretaria'` ✅
- `/admin/*` → Requiere rol `'Administrador'`

**Flujo de seguridad:**
1. Usuario intenta acceder a `/admin/usuarios`
2. Router verifica si tiene token ✅
3. Router verifica si debe cambiar contraseña ✅
4. **Router verifica si tiene rol correcto** ✅ NUEVO
5. Si no tiene rol → Redirige a su dashboard correcto

**Logs de debug:**
```
🔀 Redireccionando desde login según rol: Secretaria
✅ Permitiendo acceso a /secretaria
❌ Acceso denegado: Rol requerido 'Administrador', pero tienes 'Secretaria'
🔀 Redirigiendo a: SecretariaDashboard
```

---

## ✅ 2. ESTRUCTURA DE API CONSOLIDADA

### Antes
```
src/
  services/
    authService.ts
    usuariosService.ts
    solicitudesService.ts
```

### Ahora (Nuevo)
```
src/api/
  ├─ index.ts          ← Exporta todo (punto de entrada)
  ├─ auth.ts           ← Login, logout, datos usuario
  ├─ usuarios.ts       ← CRUD de usuarios (ADMIN)
  ├─ solicitudes.ts    ← Gestión de solicitudes
  └─ USAGE.ts          ← Guía completa de uso con ejemplos
```

### Cómo usar
```typescript
// ✅ Importación centralizada (nueva)
import { authApi, usuariosApi, solicitudesApi } from '@/api'

// También disponible (compatibilidad)
import { authService, usuariosService } from '@/api'
```

---

## ✅ 3. APIS CREADAS

### 🔐 authApi (Autenticación)
```typescript
await authApi.login({ codigo_estudiantil, password })
await authApi.changePassword({ password_actual, password_nueva, ... })
await authApi.logout()

// Nuevas funciones de ayuda
authApi.getCurrentRole()      // → 'Administrador' | 'Secretaria' | 'Estudiante'
authApi.getCurrentUser()       // → { id, nombre, email, rol, ... }
authApi.isAuthenticated()     // → boolean
```

### 👥 usuariosApi (Gestión de Usuarios - ADMIN)
```typescript
await usuariosApi.getUsuarios({ pagina, limite, rol, ... })
await usuariosApi.buscar('juan')
await usuariosApi.getById(123)
await usuariosApi.crear({ nombre_completo, email, ... })
await usuariosApi.actualizar(123, { email, ... })
await usuariosApi.desactivar(123)
await usuariosApi.reactivar(123)
await usuariosApi.cambiarMatricula(123, true|false)
await usuariosApi.obtenerEstadisticas()
```

### 📋 solicitudesApi (Gestión de Solicitudes)
```typescript
await solicitudesApi.misSolicitudes({ pagina, ... })
await solicitudesApi.obtenerSolicitudes({ pagina, rol, ... })
await solicitudesApi.obtenerDetalle(456)
await solicitudesApi.crear({ motivo, detalles })
await solicitudesApi.actualizarEstado(456, { estado: 'APROBADA', ... })
await solicitudesApi.cancelar(456)
await solicitudesApi.obtenerHistorial()
```

---

## ✅ 4. AUTOMATIZACIONES QUE YA FUNCIONAN

### ✅ Token Automático
- Se guarda automáticamente después de login
- Se envía en cada request (`Authorization: Bearer <token>`)
- ✅ Implementado en: `src/utils/httpClient.ts` (interceptor request)

### ✅ Manejo de 401 (Token Expirado)
- Si backend devuelve 401 → automáticamente:
  1. Limpia token y datos de usuario
  2. Redirige a `/login`
- ✅ Implementado en: `src/utils/httpClient.ts` (interceptor response)

### ✅ Normalización de Errores
- Todos los errores se normalizan a estructura consistente:
```typescript
{
  message: "Descripción del error",
  statusCode: 400,
  field?: "nombre_campo" // Si aplica
}
```

### ✅ Redirección por Rol
- Después del login, el router dice:
  - ADMIN → `/admin/usuarios`
  - SECRETARIA → `/secretaria`
  - ESTUDIANTE → `/dashboard`
- ✅ Implementado en: `src/router/index.ts` (beforeEach)

---

## 📊 Comparativa: QUÉ CAMBIÓ

| Aspecto | Antes | Ahora |
|---------|-------|--------|
| Rutas sin protección por rol | ❌ Inseguro | ✅ Separadas por rol |
| Importar servicios | `authService`, `usuariosService` | `authApi`, `usuariosApi` (+ antiguo) |
| API Consolidada | No | ✅ `src/api/index.ts` |
| Token en requests | ✅ Ya funcionaba | ✅ Sigue igual |
| Redirección al login expirado | ✅ Ya funcionaba | ✅ Sigue igual |
| Rol normalizado | ✅ Ya funcionaba | ✅ Sigue igual |

---

## 🎯 EJEMPLOS DE USO PRÁCTICO

### Login (LoginPage.vue)
```typescript
import { authApi } from '@/api'

const handleLogin = async () => {
  const result = await authApi.login({
    codigo_estudiantil: '20240',
    password: 'abc123'
  })
  console.log('✅ Logeado como:', result.student.rol)
  // Router automáticamente redirige según rol
}
```

### Listar Usuarios (AdminUsuarios.vue)
```typescript
import { onMounted, ref } from 'vue'
import { usuariosApi } from '@/api'

const usuarios = ref([])

onMounted(async () => {
  const result = await usuariosApi.getUsuarios({
    pagina: 1,
    limite: 10
  })
  usuarios.value = result.data
})
```

### Crear Solicitud (DashboardPage.vue)
```typescript
import { solicitudesApi } from '@/api'

const crearSolicitud = async () => {
  const nuevo = await solicitudesApi.crear({
    motivo: 'Cambio de carrera',
    detalles: {
      carrera_anterior: 'Sistemas',
      carrera_nueva: 'Administración'
    }
  })
  console.log('✅ Solicitud creada:', nuevo.codigo_solicitud)
}
```

---

## ⚙️ CONFIGURACIÓN (Sin cambios)

### Variables de entorno
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Estructura de Token
- Tipo: Bearer token
- Storage: `localStorage.auth_token`
- Envío: `Authorization: Bearer <token>`

### Estructura de Usuario
- Storage: `localStorage.auth_student`
- Contiene: `id, nombre, codigo, rol, email, carrera, semestre, ...`

---

## 🔍 LOGS DE VERIFICACIÓN

Para verificar que todo funciona correctamente:

```javascript
// 1. Verificar token después de login
console.log('Token:', localStorage.getItem('auth_token'))

// 2. Verificar rol
const student = JSON.parse(localStorage.getItem('auth_student'))
console.log('Rol:', student.rol)

// 3. Verificar que no puedes acceder a otras áreas
// Intenta ir a /admin siendo estudiante → debe redirecto

// 4. Verificar que token se envía automáticamente
// Inspecciona Network → Authorization header debe estar presente ✅

// 5. Verificar logout
authApi.logout()
console.log('Token post-logout:', localStorage.getItem('auth_token')) // null ✅
```

---

## 💾 ARCHIVOS MODIFICADOS

### Nuevos archivos
- ✅ `src/api/index.ts` - Consolidación de APIs
- ✅ `src/api/auth.ts` - API de autenticación
- ✅ `src/api/usuarios.ts` - API de usuarios
- ✅ `src/api/solicitudes.ts` - API de solicitudes
- ✅ `src/api/USAGE.ts` - Guía de uso

### Archivos actualizados
- ✅ `src/router/index.ts` - Protección por rol

### Archivos sin cambios (compatibles)
- ✅ `src/utils/httpClient.ts` - Sigue igual
- ✅ `src/services/authService.ts` - Sigue igual
- ✅ `src/services/usuariosService.ts` - Sigue igual
- ✅ `src/store/authStore.ts` - Sigue igual

---

## 🚨 NOTAS IMPORTANTES

1. **Compatibilidad backwards**: Todo el código antiguo sigue funcionando
2. **Sin breaking changes**: Puedes seguir usando `authService`, etc.
3. **Seguridad mejorada**: Secretaria ya no puede acceder a `/admin`
4. **TypeScript seguro**: Types de `requiredRole` están definidos

---

## ✅ CHECKLIST FINAL

- ✅ Token se envía automáticamente
- ✅ Rol se normaliza correctamente
- ✅ Rutas protegidas por rol
- ✅ Redirección según rol
- ✅ APIs consolidadas y documentadas
- ✅ Errores 401 manejados automáticamente
- ✅ TypeScript types definidos
- ✅ Ejemplos de uso incluidos
- ✅ Sin breaking changes
- ✅ Secretaria no puede ver admin ✅ PROBLEMA RESUELTO

---

## 📚 Siguiente paso

Lee `src/api/USAGE.ts` para ver ejemplos completos de cómo usar cada API.

```typescript
import { authApi, usuariosApi, solicitudesApi } from '@/api'

// ¡Ya está lista! 🚀
```

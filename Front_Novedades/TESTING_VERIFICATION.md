# 🧪 TESTING CHECKLIST - Verificación de la Implementación

## ✅ VERIFICACIONES RÁPIDAS

### 1. Acceso a archivos de API
```bash
# Verificar que existen todos los archivos
ls src/api/
# Debe mostrar:
# - index.ts ✅
# - auth.ts ✅
# - usuarios.ts ✅
# - solicitudes.ts ✅
# - USAGE.ts ✅
```

### 2. Importación centralizada
```typescript
// ✅ ESTO DEBE FUNCIONAR en cualquier componente
import { authApi, usuariosApi, solicitudesApi, http } from '@/api'

// ✅ También debería funcionar (backwards compatible)
import { authService } from '@/api'
```

### 3. TypeScript sin errores
```bash
npm run type-check
# Debe completar sin errores de nuestros archivos
```

---

## 🧪 PRUEBAS FUNCIONALES

### Test 1: Login y Guardian de Rutas

**Paso 1: Ir a /login**
- ✅ Se debe ver la página de login
- ✅ No debe haber redirecciones

**Paso 2: Logearse como ADMIN**
```
Código: admin_code (ajusta según tu backend)
Contraseña: password123
```
- ✅ Debe redirigir a `/admin/usuarios` automáticamente
- ✅ Abrir DevTools → Application → localStorage
- ✅ Debe existir `auth_token` ✅
- ✅ Debe existir `auth_student` con `rol: "Administrador"` ✅

**Paso 3: Intentar acceder a /secretaria siendo ADMIN**
```
Dirección: http://localhost:5173/#/secretaria
```
- ✅ DEBE REDIRIGIR a `/admin/usuarios` ❌❌❌ ESTO ERA EL PROBLEMA

---

### Test 2: Redirección por Rol

**Test 2A: ADMIN**
- Login como ADMIN
- Intenta ir a `/dashboard` → ✅ Debe redirigir a `/admin/usuarios`
- Intenta ir a `/secretaria` → ✅ Debe redirigir a `/admin/usuarios`
- Intenta ir a `/admin/usuarios` → ✅ Acceso permitido ✅

**Test 2B: SECRETARIA**
- Login como SECRETARIA
- Intenta ir a `/admin/usuarios` → ✅ Debe redirigir a `/secretaria`
- Intenta ir a `/dashboard` → ✅ Debe redirigir a `/secretaria`
- Intenta ir a `/secretaria` → ✅ Acceso permitido ✅

**Test 2C: ESTUDIANTE**
- Login como ESTUDIANTE
- Intenta ir a `/admin/usuarios` → ✅ Debe redirigir a `/dashboard`
- Intenta ir a `/secretaria` → ✅ Debe redirigir a `/dashboard`
- Intenta ir a `/dashboard` → ✅ Acceso permitido ✅

---

### Test 3: Token Automático

**Pasos:**
1. Login como cualquier usuario
2. Abrir DevTools → Network
3. Hacer click en cualquier botón que haga request (ej: cargar usuarios)
4. Ver el request en Network
5. En Headers → buscar `Authorization`

**Esperado:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- ✅ Debe estar presente automáticamente
- ✅ NO debe ser nulo
- ✅ Debe empezar con `Bearer `

---

### Test 4: Token Expirado (401)

**Pasos:**
1. Login
2. En DevTools → Application → localStorage
3. Modificar `auth_token` a cualquier string aleatorio (ej: "invalid123")
4. Hacer un request (ej: cargar usuarios)

**Esperado:**
- ✅ Backend devuelve 401
- ✅ Automáticamente limpia localStorage
- ✅ Automáticamente redirige a `/login`
- ✅ Se ve el mensaje de error

---

### Test 5: Uso de API en Componentes

**Prueba en LoginForm.vue:**
```typescript
import { authApi } from '@/api'

console.log('✅ authApi cargado:', authApi)
console.log('✅ Métodos:', Object.keys(authApi))
// Debe mostrar: login, changePassword, logout, isAuthenticated, getCurrentRole, getCurrentUser
```

**Prueba en AdminUsuarios.vue:**
```typescript
import { ref, onMounted } from 'vue'
import { usuariosApi } from '@/api'

const usuarios = ref([])

onMounted(async () => {
  try {
    const result = await usuariosApi.getUsuarios({ pagina: 1, limite: 10 })
    usuarios.value = result.data
    console.log('✅ Usuarios cargados:', usuarios.value.length)
  } catch (error) {
    console.error('❌ Error:', error)
  }
})
```

---

## 📊 Resultado de Test Esperado

| Test | Antes | Después | Status |
|------|-------|---------|--------|
| Secretaria ve admin | ❌ SI | ✅ NO | RESUELTO |
| Token en requests | ✅ SI | ✅ SI | OK |
| Redirige por rol | ❌ NO | ✅ SI | NUEVO |
| 401 redirige a login | ✅ SI | ✅ SI | OK |
| API consolidada | ❌ NO | ✅ SI | NUEVO |

---

## 🐛 Debugging

### Logs de Debug en Router

En DevTools → Console deberías ver:

```
✅ Login:
🔀 Redireccionando desde login según rol: Administrador

✅ Acceso permitido:
(sin mensajes)

❌ Acceso denegado:
❌ Acceso denegado: Rol requerido 'Administrador', pero tienes 'Secretaria'
🔀 Redirigiendo a: SecretariaDashboard
```

### Verificar localStorage

```javascript
// En DevTools → Console:
const student = JSON.parse(localStorage.getItem('auth_student'))
console.log('Rol:', student.rol)      // Debe ser: Administrador, Secretaria, Estudiante
console.log('Token:', !!localStorage.getItem('auth_token')) // Debe ser: true
```

---

## 📝 Checklist Final

- [ ] ✅ Router protege rutas por rol
- [ ] ✅ Secretaria NO puede acceder a /admin
- [ ] ✅ Admin NO puede acceder a /secretaria
- [ ] ✅ Estudiante NO puede acceder a /secretaria ni /admin
- [ ] ✅ Token se envía automáticamente
- [ ] ✅ 401 redirige a /login
- [ ] ✅ APIs importables desde @/api
- [ ] ✅ TypeScript sin errores
- [ ] ✅ Sin breaking changes
- [ ] ✅ Código antiguo sigue funcionando

---

## 🎯 Conclusión

Si todos los tests pasaron: **¡TODO FUNCIONA! 🚀**

La integración de API está lista. Los siguiente sería:
1. Actualizar componentes para importar desde `@/api`
2. Agregar más servicios según necesidad
3. Expandir con validaciones adicionales

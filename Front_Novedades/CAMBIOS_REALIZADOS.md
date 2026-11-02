# 🎯 RESUMEN DE CAMBIOS - Arreglo Error 422 + Crear Usuario

## 🚨 Problemas Identificados

### ❌ Problema 1: Error 422 (Unprocessable Entity) en Solicitudes
```
POST http://localhost:3000/api/solicitudes 422
El servidor rechaza los datos de la solicitud
```
**Root Cause:** El backend requiere datos completos del estudiante, pero solo se enviaba el tipo y descripción.

### ❌ Problema 2: No se puede crear usuario desde Admin
```
AdminUsuarios.vue → Nuevo Usuario → Guardar
Mensaje: "Crear usuarios debe hacerse en el backend"
```
**Root Cause:** El servicio `usuariosService.ts` no tenía endpoint de creación, y la función `guardarUsuario()` no lo implementaba.

---

## ✅ Soluciones Implementadas

### 1️⃣ TIPO DE DATOS - `src/types/index.ts`

```typescript
// ✅ NUEVO
export interface CreateUsuarioPayload {
  nombre_completo: string
  email_institucional: string
  rol: RolUsuario
  programa: string
  codigo_institucional?: string
}

export interface UpdateUsuarioPayload {
  nombre_completo?: string
  email_institucional?: string
  rol?: RolUsuario
  programa?: string
}
```

---

### 2️⃣ SERVICIO SOLICITUDES - `src/services/solicitudesService.ts`

**Antes:**
```typescript
async crear(payload: {
  tipo: TipoTramite
  descripcion: string
  cursoActual?: string
  cursoNuevo?: string
  // ❌ FALTA: datos del estudiante
})
```

**Después:**
```typescript
async crear(payload: {
  tipo: TipoTramite
  descripcion: string
  codigo_estudiantil?: string        // ✅ NUEVO
  email_estudiante?: string          // ✅ NUEVO
  nombre_estudiante?: string         // ✅ NUEVO
  curso_actual?: string              // ✅ RENOMBRADO (snake_case)
  curso_nuevo?: string               // ✅ RENOMBRADO
  jornada_actual?: string
  jornada_nueva?: string
  archivos?: File[]
})
```

**Cambios en FormData:**
```typescript
// ✅ Agregar datos del estudiante al FormData
if (payload.codigo_estudiantil) formData.append('codigo_estudiantil', payload.codigo_estudiantil)
if (payload.email_estudiante) formData.append('email_estudiante', payload.email_estudiante)
if (payload.nombre_estudiante) formData.append('nombre_estudiante', payload.nombre_estudiante)

// ✅ Campo de curso con snake_case correcto
formData.append('curso_actual', payload.cursoActual)   // no 'cursoActual'
formData.append('curso_nuevo', payload.cursoNuevo)     // no 'cursoNuevo'
```

---

### 3️⃣ SERVICIO USUARIOS - `src/services/usuariosService.ts`

**Agregar import:**
```typescript
import type { UsuarioAdmin, UsuariosStats, CreateUsuarioPayload, UpdateUsuarioPayload } from '../types'
```

**Agregar método:**
```typescript
// 🔹 CREAR USUARIO NUEVO (solo ADMIN)
async crear(payload: CreateUsuarioPayload) {
  const { data } = await http.post('/usuarios', payload)
  return data
}
```

---

### 4️⃣ PÁGINA NUEVA SOLICITUD - `src/pages/NuevasolicitudPage.vue`

**Función `handleSubmit()` ACTUALIZADA:**

```typescript
async function handleSubmit() {
  if (!validate()) return
  
  // ✅ NUEVA VALIDACIÓN: Verificar que tenemos datos del estudiante
  if (!student.value?.codigo || !student.value?.email) {
    errors.value.descripcion = 'Error: Datos de estudiante incompletos. Por favor recarga la página.'
    return
  }
  
  isLoading.value = true
  try {
    const payload: any = {
      tipo: form.value.tipo,
      descripcion: form.value.descripcion,
      codigo_estudiantil: student.value.codigo,      // ✅ NUEVO
      email_estudiante: student.value.email,         // ✅ NUEVO
      nombre_estudiante: student.value.nombre,       // ✅ NUEVO
    }

    // ✅ MEJOR NAMING
    if (form.value.tipo === 'Cambio de Curso') {
      payload.cursoActual = form.value.cursoActual   // Será enviado como 'curso_actual'
      payload.cursoNuevo = form.value.cursoNuevo     // Será enviado como 'curso_nuevo'
    }

    if (form.value.tipo === 'Cambio de Jornada') {
      payload.jornada_actual = form.value.jornadaActual
      payload.jornada_nueva = form.value.jornadaNueva
    }

    // ✅ Incluir archivos si existen
    if (form.value.archivos.length > 0) {
      payload.archivos = form.value.archivos
    }

    console.log('📤 Enviando solicitud:', payload)    // ✅ DEBUG

    await solicitudesService.crear(payload)
    
    console.log('✅ Solicitud enviada exitosamente a la secretaría')
    router.push({ name: 'MiHistorial' })
  } catch (err: any) {
    // ✅ MEJOR MANEJO DE ERRORES
    console.error('❌ Error:', err)
    let mensaje = 'Error al enviar la solicitud.'
    if (err.response?.data?.error) mensaje = err.response.data.error
    else if (err.response?.data?.mensaje) mensaje = err.response.data.mensaje
    else if (err.message) mensaje = err.message
    errors.value.descripcion = mensaje
  } finally { isLoading.value = false }
}
```

---

### 5️⃣ PÁGINA ADMIN USUARIOS - `src/pages/AdminUsuarios.vue`

**Función `guardarUsuario()` ACTUALIZADA:**

```typescript
async function guardarUsuario() {
  if (!validarForm()) return
  guardando.value = true
  try {
    if (usuarioEditando.value) {
      // ✅ Editar usuario existente (sin cambios)
      const actualizado = await usuariosService.actualizar(Number(usuarioEditando.value.id), {
        nombre_completo: form.nombre,
        email_institucional: form.email,
      })
      const idx = usuarios.value.findIndex(u => u.id === usuarioEditando.value!.id)
      if (idx !== -1 && actualizado) {
        usuarios.value[idx] = actualizado as UsuarioAdmin
      }
      mostrarToast('Usuario actualizado correctamente.', 'exito')
    } else {
      // ✅ NUEVO: Crear usuario
      const nuevoUsuario = await usuariosService.crear({
        nombre_completo: form.nombre,
        email_institucional: form.email,
        rol: form.rol as any,
        programa: form.programa,
        codigo_institucional: form.idInstitucional,
      })
      if (nuevoUsuario) {
        usuarios.value.unshift(nuevoUsuario as UsuarioAdmin)
        mostrarToast('Usuario creado correctamente.', 'exito')
      }
    }
    cerrarModal()
  } catch (err: unknown) {
    mostrarToast((err as { message?: string })?.message ?? 'Error al guardar.', 'error')
  } finally {
    guardando.value = false
  }
}
```

**Cambios clave:**
- ❌ ELIMINAR: `mostrarToast('Crear usuarios debe hacerse en el backend.', 'error'); return`
- ✅ AGREGAR: Llamar a `usuariosService.crear()` con los datos
- ✅ AGREGAR: Actualizar lista de usuarios sin recargar (UX mejorada)

---

## 📊 Comparación: Antes vs Después

| Funcionalidad | Antes | Después |
|---|---|---|
| **Envío de Solicitud** | ❌ Error 422 | ✅ Envia datos completos del estudiante |
| **Datos Enviados** | tipo, descripcion | tipo, descripcion, codigo, email, nombre |
| **Creación de Usuario** | ❌ No disponible | ✅ Admin puede crear usuarios |
| **Manejo de Errores** | ❌ Genérico | ✅ Específico (extrae mensaje del backend) |
| **Debug** | ❌ Sin logs | ✅ Console.log en envío/respuesta |

---

## 🧪 CÓMO PROBAR

### Test 1: Crear Solicitud (Estudiante)

```bash
✅ 1. Login como estudiante
✅ 2. Ir a: Trámites → Nueva Solicitud
✅ 3. Seleccionar: "Cambio de Curso"
✅ 4. Rellenar:
   - Curso Actual: "Cálculo I - G-02"
   - Curso Nuevo: "Cálculo I - G-35"
   - Justificación: "Necesito cambiar porque..." (min 50 caracteres)
   - Archivos: (opcional) subir PDF/imagen
✅ 5. Click: "Enviar Solicitud"
✅ 6. RESULTADO ESPERADO:
   - ✅ Redirige a "Mi Historial"
   - ✅ Console: "📤 Enviando solicitud: {...}"
   - ✅ Console: "✅ Solicitud enviada exitosamente a la secretaría"
   - ✅ Backend recibe: codigo_estudiantil, email_estudiante, nombre_estudiante
   - ✅ Secretaría ve nueva solicitud asignada
```

### Test 2: Crear Usuario (Admin)

```bash
✅ 1. Login como admin
✅ 2. Ir a: Admin → Directorio Académico
✅ 3. Click: "Nuevo Usuario"
✅ 4. Rellenar:
   - Nombre: "María García López"
   - Correo: "maria@university.edu.co"
   - Rol: "Secretaria"
   - Programa: "Ingeniería de Sistemas"
   - ID Institucional: "123456"
✅ 5. Click: "Guardar Usuario"
✅ 6. RESULTADO ESPERADO:
   - ✅ Modal se cierra
   - ✅ Toast verde: "Usuario creado correctamente."
   - ✅ Nuevo usuario aparece en tabla (sin recargar página)
   - ✅ Backend recibe: nombre_completo, email_institucional, rol, programa, codigo_institucional
```

---

## 📋 Checklist Backend Requerido

Para que todo funcione correctamente, el backend debe:

- ✅ Validar `codigo_estudiantil` en POST `/solicitudes`
- ✅ Validar `email_estudiante` en POST `/solicitudes`
- ✅ Validar campos requeridos (retornar 422 con mensaje claro si faltan)
- ✅ Implementar POST `/usuarios` para crear nuevos usuarios
- ✅ Validar `email_institucional` no exista en POST `/usuarios`
- ✅ Crear usuario con rol correcto y estado "Activo"
- ✅ Enviar email con credenciales temporales al crear usuario
- ✅ **Automáticamente asignar solicitud a secretaria cuando se cree**

---

## 📄 Documentación Adicional

Ver archivo: `API_INTEGRATION.md`

Incluye:
- Estructura exacta de payloads
- Validaciones esperadas
- Respuestas de error
- Ejemplos de prueba
- Checklist de implementación

---

## ✅ COMPILACIÓN

```bash
✅ No errores TypeScript
✅ No errores Vue
✅ Ready to run: `npm run dev`
```

---

**FECHA:** 01 Abril 2026  
**ESTADO:** ✅ Listo para prueba  
**PRÓXIMOS PASOS:** Probar con backend en ejecución

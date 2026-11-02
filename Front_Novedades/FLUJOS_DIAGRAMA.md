# 📊 FLUJOS CORREGIDOS

## 1️⃣ FLUJO: Envío de Solicitud (Estudiante → Secretaría)

```
┌─────────────────────────────────┐
│  NuevasolicitudPage.vue         │
│  handleSubmit()                 │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Validación Frontend            │
│  ✅ tipo seleccionado           │
│  ✅ descripcion >= 50 chars     │
│  ✅ student.codigo existe       │
│  ✅ student.email existe        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  solicitudesService.crear()     │
│                                 │
│  FormData con:                  │
│  ✅ tipo                        │
│  ✅ descripcion                 │
│  ✅ codigo_estudiantil (NUEVO)  │
│  ✅ email_estudiante (NUEVO)    │
│  ✅ nombre_estudiante (NUEVO)   │
│  ✅ curso_actual / curso_nuevo  │
│  ✅ jornada_actual / jornada..  │
│  ✅ archivos (si existen)       │
└──────────────┬──────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  POST /api/solicitudes           │
│  (Backend valida todos los datos)│
│  422 = datos incompletos ✅      │
│  200 = éxito                     │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Backend:                        │
│  ✅ Crear registro en BD         │
│  ✅ Guardar archivos            │
│  ✅ ASIGNAR A SECRETARIA        │
│  ✅ Enviar notificación         │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Respuesta: { id, estado, ... } │
│  Frontend redirige a MiHistorial │
└──────────────────────────────────┘
```

---

## 2️⃣ FLUJO: Creación de Usuario (Admin)

```
┌─────────────────────────────────┐
│  AdminUsuarios.vue              │
│  Modal: Crear Nuevo Usuario     │
└──────────────┬──────────────────┘
               │ (UsuarioEditando = null)
               ▼
┌─────────────────────────────────┐
│  Validación Formulario          │
│  ✅ nombre no vacío             │
│  ✅ email no vacío              │
│  ✅ rol seleccionado            │
│  ✅ programa seleccionado       │
│  ✅ ID institucional no vacío    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  guardarUsuario()               │
│                                 │
│  Lama:                          │
│  usuariosService.crear({        │
│    nombre_completo,             │
│    email_institucional,         │
│    rol,                         │
│    programa,                    │
│    codigo_institucional         │
│  })                             │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  POST /api/usuarios             │
│  (Backend valida)               │
│  409 = email ya existe ✅       │
│  201 = creado                   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Backend:                       │
│  ✅ Crear usuario en BD         │
│  ✅ Contraseña temporal         │
│  ✅ Enviar email con creds      │
│  ✅ Estado: "Activo"            │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Response: { id, nombre, ... }  │
│  Frontend:                      │
│  ❌ (ANTES) Mostrar error       │
│  ✅ (AHORA) Agregar a lista     │
│  ✅ Toast: "Usuario creado"     │
│  ✅ Modal se cierra             │
│  ✅ Sin recargar página         │
└─────────────────────────────────┘
```

---

## 3️⃣ DIFERENCIA DE PAYLOADS

### ANTES ❌
```javascript
// POST /api/solicitudes
{
  "tipo": "Cambio de Curso",
  "descripcion": "...",
  // ❌ FALTA: datos del estudiante
}
// Backend rechaza: 422 Unprocessable Entity
```

### AHORA ✅
```javascript
// POST /api/solicitudes
{
  "tipo": "Cambio de Curso",
  "descripcion": "...",
  "codigo_estudiantil": "20240",           // ✅ NUEVO
  "email_estudiante": "juan@uni.edu",     // ✅ NUEVO
  "nombre_estudiante": "Juan Pérez",      // ✅ NUEVO
  "curso_actual": "Cálculo I - G-02",
  "curso_nuevo": "Cálculo I - G-35",
  "archivos": [File, File]
}
// Backend acepta y asigna a secretaria: 200 OK
```

---

## 4️⃣ INTEGRACIÓN SECRETARÍA

```
Cuando se crea solicitud:

ESTUDIANTE                  BACKEND              SECRETARIA
    │                          │                     │
    ├─ POST /solicitudes ──────>                    │
    │                          │                     │
    │    <── 200 OK ───────────┤                    │
    │                          ├─ Crear en BD       │
    │                          ├─ ASIGNAR A ──────> Notificación
    │                          │   SECRETARIA        │
    │                          │                     ├─ Ver en Dashboard
    │                          │                     ├─ Click → Detalle
    │                          │                     └─ Aprobar/Rechazar
    │                          │
    └─ MiHistorial          Ver estado en historial
         (Pendiente)
```

---

## 5️⃣ MATRIZ DE CAMPOS VALIDADOS

| Campo | Solicitud | Usuario | Validación |
|-------|-----------|---------|-----------|
| nombre / nombre_completo | - | ✅ | Min 3 chars |
| email / email_institucional | ✅ | ✅ | Formato válido, único en usuarios |
| codigo_estudiantil | ✅ | - | Requerido |
| tipo | ✅ | - | Enum: Cambio de Curso, etc |
| descripcion | ✅ | - | Min 50 chars |
| rol | - | ✅ | Enum: Admin, Secretaria, etc |
| programa | - | ✅ | Requerido |
| archivos | ✅ opcional | - | PDF/JPEG/PNG, max 5MB |

---

**✅ Todos los cambios están listos para prueba en el backend**

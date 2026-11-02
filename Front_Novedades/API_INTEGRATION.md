# 📡 Integración API Frontend-Backend

## ✅ SOLICITUDES - Envío Correctivado

### POST `/api/solicitudes` - Crear Solicitud de Cambios

**Datos que envía el frontend:**
```javascript
{
  "tipo": "Cambio de Curso",           // ✅ TipoTramite requerido
  "descripcion": "...",                 // ✅ Justificación (min 50 caracteres)
  "codigo_estudiantil": "20240",        // ✅ NUEVO: Código del estudiante
  "email_estudiante": "user@uni.edu",   // ✅ NUEVO: Email del estudiante
  "nombre_estudiante": "Juan Pérez",    // ✅ NUEVO: Nombre del estudiante
  "curso_actual": "Cálculo I - G-02",   // ⚠️ Solo si tipo="Cambio de Curso"
  "curso_nuevo": "Cálculo I - G-35",    // ⚠️ Solo si tipo="Cambio de Curso"
  "jornada_actual": "mañana",           // ⚠️ Solo si tipo="Cambio de Jornada"
  "jornada_nueva": "tarde",             // ⚠️ Solo si tipo="Cambio de Jornada"
  "archivos": [File, File, ...]         // ⚠️ Opcional: PDFs, JPGs, PNGs (max 5MB c/u)
}
```

**Validaciones Backend:**
1. ✅ Tipos requeridos: `tipo`, `descripcion`, `codigo_estudiantil`, `email_estudiante`
2. ✅ Validar formato campos específicos según tipo de trámite
3. ✅ Guardar solicitud con estado "Pendiente"
4. ✅ **Enviar automáticamente a Secretaría** (crear notificación/tarea para secretaria)

**Respuesta esperada (200):**
```javascript
{
  "id": "SOL-001",
  "tipo": "Cambio de Curso",
  "estado": "Pendiente",
  "fechaEnvio": "2026-04-01T10:30:00Z",
  "codigo_estudiantil": "20240",
  "mensaje": "Solicitud enviada exitosamente a la secretaría"
}
```

**Errores esperados:**
- `422`: Dato faltante o formato incorrecto (revisar campos requeridos)
- `401`: Usuario no autenticado
- `500`: Error del servidor

---

## ✅ USUARIOS - Crear Nuevo Usuario (ADMIN)

### POST `/api/usuarios` - Crear Usuario

**Datos que envía el frontend:**
```javascript
{
  "nombre_completo": "Juan Pérez López",     // ✅ Requerido (min 3 caracteres)
  "email_institucional": "juan@uni.edu.co",  // ✅ Requerido (email válido)
  "rol": "Secretaria",                       // ✅ Requerido: 'Administrador' | 'Secretaria' | 'Estudiante' | 'Docente'
  "programa": "Ingeniería de Sistemas",      // ✅ Requerido
  "codigo_institucional": "123456"           // ⚠️ Opcional
}
```

**Validaciones Backend:**
1. ✅ Verificar que ADMIN envía la solicitud (guard)
2. ✅ Validar email no exista
3. ✅ Crear usuário con contraseña temporal
4. ✅ Enviar email de bienvenida con contraseña temporal

**Respuesta esperada (201):**
```javascript
{
  "id": "5",
  "nombre": "Juan Pérez López",
  "email": "juan@uni.edu.co",
  "rol": "Secretaria",
  "programa": "Ingeniería de Sistemas",
  "estado": "Activo",
  "fecha_creacion": "2026-04-01T10:30:00Z",
  "mensaje": "Usuario creado exitosamente. Email con credenciales enviado."
}
```

**Errores esperados:**
- `400`: Datos incompletos o inválidos
- `409`: Email ya existe
- `422`: Rol o programa no válido
- `403`: Solo ADMIN puede crear usuarios
- `500`: Error del servidor

---

## 🔄 Integración Automática - Secretaría

Cuando se crea una solicitud:

1. ✅ Guardar en tabla `solicitudes`
2. ✅ Guardar archivos adjuntos
3. ✅ **Crear registro en `secretaria_tareas`** o similar para que la secretaria lo vea
4. ✅ Disponer evento/notificación: "Nueva solicitud de Juan Pérez"
5. ✅ Cambiar estado a "Asignada" cuando secretaria la tome
6. ✅ Permitir aprobación/rechazo

---

## 🛠️ Checklist Implementación Backend

**Tabla Solicitudes:**
```sql
CREATE TABLE solicitudes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  codigo_estudiantil VARCHAR(20) NOT NULL,
  email_estudiante VARCHAR(100) NOT NULL,
  nombre_estudiante VARCHAR(100) NOT NULL,
  curso_actual VARCHAR(100),
  curso_nuevo VARCHAR(100),
  jornada_actual VARCHAR(20),
  jornada_nueva VARCHAR(20),
  estado ENUM('Pendiente', 'En Revisión', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  asignada_a_secretaria_id INT,
  fecha_decision TIMESTAMP,
  razon_rechazo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tabla Usuarios (si no existe):**
```sql
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS codigo_institucional VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS programa VARCHAR(100);
```

---

## 🧪 Pruebas Frontend

### 1️⃣ Test: Crear Solicitud

```bash
# 1. Login como estudiante
POST /auth/login
{ "codigo_estudiantil": "20240", "password": "..." }

# 2. Crear solicitud
POST /solicitudes
{ 
  "tipo": "Cambio de Curso",
  "descripcion": "Necesito cambiar de grupo porque tengo conflicto de horario con mi trabajo...",
  "codigo_estudiantil": "20240",
  "email_estudiante": "juan@uni.edu",
  "nombre_estudiante": "Juan",
  "curso_actual": "Cálculo I - G-02",
  "curso_nuevo": "Cálculo I - G-35"
}

# ✅ Esperar respuesta exitosa
# ✅ Verificar en BD que se creó y se asignó a secretaria
```

### 2️⃣ Test: Crear Usuario

```bash
# 1. Login como admin
POST /auth/login
{ "codigo_estudiantil": "ADMIN001", "password": "..." }

# 2. Crear usuario
POST /usuarios
{
  "nombre_completo": "María García",
  "email_institucional": "maria@uni.edu.co",
  "rol": "Secretaria",
  "programa": "Ingeniería de Sistemas"
}

# ✅ Esperar 201 Created
# ✅ Verificar en BD que se creó
# ✅ Verificar que se pueda loguear con credenciales temporales
```

---

## ⚠️ Errores Comunes del Error 422

**Causa 1: Campos faltantes**
```
Error: { error: "field 'codigo_estudiantil' is required" }
✅ Solución: Enviar todos los datos en handleSubmit
```

**Causa 2: Tipos de datos incorrectos**
```
Error: { error: "field 'tipo' must be one of: Cambio de Curso, Cambio de Jornada" }
✅ Solución: Validar enumeración en frontend también
```

**Causa 3: Longitud de campos**
```
Error: { error: "field 'descripcion' must be at least 50 characters" }
✅ Solución: Ya validado en frontend (línea 311 de NuevasolicitudPage.vue)
```

**Causa 4: Formato de email**
```
Error: { error: "field 'email_estudiante' must be valid email" }
✅ Solución: El auth.student.email viene validado del backend
```


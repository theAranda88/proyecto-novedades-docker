# 📚 Carga de Información del Estudiante en Tiempo Real

## 🎯 Cambios Implementados

### Problema
La información del estudiante en el dashboard (carrera, semestre, email, promedio) no se estaba cargando correctamente desde el backend.

### Solución
Implementación de carga dinámica de datos del estudiante con fallback a datos del login.

---

## 📝 Archivos Modificados

### 1. `src/services/authService.ts`
**Cambios:**
- ✅ Actualizada interfaz `BackendLoginResponse` para incluir:
  - `carrera` (opcional)
  - `programa` (opcional)
  - `semestre` (número)
  - `email` (string)
  - `promedio` (number | string)
  - `avatarUrl` (URL del avatar)

- ✅ Actualizado mapeo en función `login()`:
  ```typescript
  student: {
    id: String(data.datos.id_usuario),
    nombre: data.datos.nombre_completo,
    codigo: data.datos.codigo_estudiantil || '',
    rol: normalizedRol,
    carrera: data.datos.carrera,           // ✅ NUEVO
    programa: data.datos.programa,         // ✅ NUEVO
    semestre: data.datos.semestre,         // ✅ NUEVO
    email: data.datos.email,               // ✅ NUEVO
    promedio: data.datos.promedio,         // ✅ NUEVO
    avatarUrl: data.datos.avatarUrl,       // ✅ NUEVO
  }
  ```

- ✅ Actualizado mapeo en función `changePassword()` (idéntico)

### 2. `src/services/estudianteService.ts`
**Cambios:**
- ✅ Agregado método `getInfoCompleta()`:
  ```typescript
  async getInfoCompleta(): Promise<StudentInfo> {
    const { data } = await http.get<StudentInfo>('/estudiantes/info')
    return data
  }
  ```
  Endpoint: `GET /estudiantes/info`

### 3. `src/pages/DashboardPage.vue`
**Cambios en script:**
- ✅ Import de `estudianteService`
- ✅ Ref `loadingInfo` para estado de carga
- ✅ Acceso directo a `authStore` (no solo storeToRefs)
- ✅ En `onMounted()`:
  - Llamar a `estudianteService.getInfoCompleta()`
  - Actualizar `authStore.student` con datos completos
  - Guardar en localStorage para persistencia
  - Manejo de errores con fallback

**Cambios en template:**
- ✅ Agregar tarjeta de información del estudiante (nueva sección)
- ✅ Mostrar:
  - Programa Académico
  - Semestre Actual
  - Email Institucional
  - Promedio Académico
- ✅ Estado de carga con skeleton loaders
- ✅ Fallback a "—" si los datos no están disponibles
- ✅ Usar `student?.programa || student?.carrera` (prioridad a programa)

---

## 🔄 Flujo de Carga

```
1. Usuario inicia sesión
   ↓
2. authService.login() mapea datos básicos del backend
   ├─ código, nombre, rol, carrera, programa, semestre, email, promedio
   ↓
3. Datos se guardan en authStore y localStorage
   ↓
4. Dashboard monta (onMounted)
   ├─ Llama a estudianteService.getInfoCompleta()
   │  └─ GET /estudiantes/info
   ↓
5. Si éxito: actualizar estudiante con info completa
   └─ Si error: usar datos que ya tenemos del login (fallback)
   ↓
6. Mostrar tarjeta de información del estudiante
   └─ Con valores reales o "—" si no existen
```

---

## 📡 Endpoints Requeridos en Backend

### 1. POST `/auth/login` - YA EXISTE
**Debe retornar ahora:**
```json
{
  "ok": true,
  "datos": {
    "id_usuario": 1,
    "nombre_completo": "Juan Pérez",
    "codigo_estudiantil": "20240",
    "email": "juan@university.edu.co",
    "rol": "ESTUDIANTE",
    "carrera": "Ingeniería de Sistemas",
    "programa": "Ingeniería de Sistemas",
    "semestre": 5,
    "promedio": 4.2,
    "avatarUrl": "https://...",
    "token": "eyJhbGc...",
    "primer_login": false
  }
}
```

### 2. GET `/estudiantes/info` - NUEVO
**Parámetros:** Ninguno (usa token en header)  
**Retorna:**
```json
{
  "id": "1",
  "nombre": "Juan Pérez",
  "codigo": "20240",
  "email": "juan@university.edu.co",
  "rol": "Estudiante",
  "carrera": "Ingeniería de Sistemas",
  "programa": "Ingeniería de Sistemas",
  "semestre": 5,
  "promedio": 4.2,
  "avatarUrl": "https://...",
  "requiresPasswordChange": false
}
```

---

## 🎨 Visualización

### Antes
```
¡Hola de nuevo, Juan Pérez! 👋
{carrera} | {semestre}º Semestre | Código: {codigo}
```

### Ahora
```
¡Hola de nuevo, Juan Pérez! 👋
{programa} | {semestre}º Semestre | Código: {codigo}

┌─────────────────────────────────────────────────────────┐
│ Programa Académico    │ Semestre Actual │ Email │ Promedio │
│ Ingeniería de Sistemas│ 5º              │...   │ 4.2     │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Características

- ✅ **Carga dinámica:** Obtiene datos frescos al entrar al dashboard
- ✅ **Fallback:** Si falla el endpoint, usa datos del login
- ✅ **Persistencia:** Guarda en localStorage inmediatamente
- ✅ **Loading state:** Muestra skeleton loaders mientras carga
- ✅ **Debug:** Logs en console para ver qué se cargó
- ✅ **Actualización automática:** Si actualizan datos en backend, se cargan al recargar
- ✅ **Responsivo:** Información bien formateada en tarjeta

---

## 📊 Datos que se Cargan

| Campo | Fuente | Mostrado en |
|-------|--------|-------------|
| nombre | login | Saludo principal |
| codigo | login | Subtitle + tarjeta |
| programa | login + endpoint | Tarjeta |
| carrera | login + endpoint | Fallback para programa |
| semestre | login + endpoint | Subtitle + tarjeta |
| email | login + endpoint | Tarjeta |
| promedio | login + endpoint | Tarjeta |
| rol | login | Store (no visible) |
| avatarUrl | login + endpoint | Para avatar (futuro) |

---

## ✅ Validación

- ✅ Sin errores TypeScript
- ✅ Sin errores Vue
- ✅ Compilación correcta
- ✅ Tipos bien validados
- ✅ Fallbacks implementados

---

**Status:** ✅ Listo para prueba con backend

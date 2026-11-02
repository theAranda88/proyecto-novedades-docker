/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 GUÍA DE USO - API CI INTEGRACIÓN
 * 
 * Este archivo documenta cómo usar los APIs.
 * No es código ejecutable, es una REFERENCIA.
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚡ ACCESO RÁPIDO:
 * - Token: ✅ Automático (se envía en cada request)
 * - Errores 401: ✅ Automático (redirige a /login)
 * - Interceptores: ✅ Ya configurados en httpClient.ts
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Para REALMENTE usar esto en un componente, copia el código y adapta.
// Estos son ejemplos que NO se ejecutan en este archivo.

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 1️⃣  LOGIN (AUTENTICACIÓN)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Importar en LoginPage.vue o LoginForm.vue:
 * 
 * import { authApi } from '@/api'
 * 
 * async function handleLogin(codigo: string, password: string) {
 *   try {
 *     const result = await authApi.login({
 *       codigo_estudiantil: codigo,
 *       password: password
 *     })
 * 
 *     console.log('✅ Login exitoso!')
 *     console.log('👤 Rol:', result.student.rol)
 *     // Token guardado automáticamente en localStorage
 *     // -> authApi.logout() para cerrar sesión
 *   } catch (error) {
 *     console.error('❌ Error:', error)
 *   }
 * }
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 2️⃣  USUARIOS (SOLO ADMIN)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Importar en AdminUsuarios.vue:
 * 
 * import { usuariosApi } from '@/api'
 * 
 * // Listar usuarios
 * const usuarios = await usuariosApi.getUsuarios({
 *   pagina: 1,
 *   limite: 10,
 *   rol: 'ESTUDIANTE', // opcional
 *   activo: true // opcional
 * })
 * console.log('📋 Usuarios:', usuarios.data)
 * console.log('📊 Total:', usuarios.total)
 * 
 * // Buscar usuario
 * const resultados = await usuariosApi.buscar('juan')
 * console.log('🔍 Encontrados:', resultados)
 * 
 * // Obtener detalle
 * const usuario = await usuariosApi.getById(123)
 * console.log('👤 Usuario:', usuario)
 * 
 * // Crear usuario
 * const nuevoUsuario = await usuariosApi.crear({
 *   nombre_completo: 'Juan Pérez',
 *   codigo_estudiantil: '20240',
 *   email_institucional: 'juan.perez@universidad.edu',
 *   rol: 'ESTUDIANTE',
 *   carrera: 'Ingeniería de Sistemas',
 *   semestre: 5
 * })
 * 
 * // Actualizar usuario
 * const actualizado = await usuariosApi.actualizar(123, {
 *   nombre_completo: 'Juan Carlos Pérez',
 *   email_institucional: 'juan.carlos@universidad.edu'
 * })
 * 
 * // Desactivar usuario
 * const desactivado = await usuariosApi.desactivar(123)
 * 
 * // Reactivar usuario
 * const reactivado = await usuariosApi.reactivar(123)
 * 
 * // Cambiar estado de matrícula
 * const matricula = await usuariosApi.cambiarMatricula(123, true)
 * // true = activa, false = inactiva
 * 
 * // Estadísticas
 * const stats = await usuariosApi.obtenerEstadisticas()
 * console.log('📊 Total usuarios:', stats.total_usuarios)
 * console.log('👥 Estudiantes:', stats.estudiantes)
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 3️⃣  SOLICITUDES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Importar en DashboardPage.vue o SolicitudesTabla.vue:
 * 
 * import { solicitudesApi } from '@/api'
 * 
 * // Mis solicitudes (para estudiante)
 * const misSolicitudes = await solicitudesApi.misSolicitudes({
 *   pagina: 1,
 *   limite: 20,
 *   estado: 'PENDIENTE' // opcional
 * })
 * console.log('📋 Mis solicitudes:', misSolicitudes.data)
 * 
 * // Todas las solicitudes (para ADMIN/SECRETARIA)
 * const todasSolicitudes = await solicitudesApi.obtenerSolicitudes({
 *   pagina: 1,
 *   limite: 20,
 *   estado: 'APROBADA',
 *   id_estudiante: 123 // opcional
 * })
 * 
 * // Detalle de solicitud
 * const detalle = await solicitudesApi.obtenerDetalle(456)
 * console.log('📄 Detalle:', detalle)
 * 
 * // Crear solicitud (estudiante)
 * const nuevaSolicitud = await solicitudesApi.crear({
 *   motivo: 'Cambio de carrera',
 *   detalles: {
 *     carrera_anterior: 'Sistemas',
 *     carrera_nueva: 'Administración',
 *     semestre: 5
 *   }
 * })
 * 
 * // Actualizar estado (ADMIN/SECRETARIA)
 * const aprobada = await solicitudesApi.actualizarEstado(456, {
 *   estado: 'APROBADA',
 *   observaciones: 'Revisado y aprobado'
 * })
 * 
 * // Cancelar solicitud
 * const cancelada = await solicitudesApi.cancelar(456)
 * 
 * // Historial
 * const historial = await solicitudesApi.obtenerHistorial({
 *   pagina: 1,
 *   limite: 50
 * })
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 4️⃣  USO CON VUE 3 COMPOSITION API
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ejemplo en DashboardPage.vue:
 * 
 * import { onMounted, ref } from 'vue'
 * import { solicitudesApi } from '@/api'
 * 
 * export default {
 *   setup() {
 *     const solicitudes = ref([])
 *     const loading = ref(false)
 *     const errorMessage = ref<string | null>(null)
 * 
 *     const cargarSolicitudes = async () => {
 *       loading.value = true
 *       errorMessage.value = null
 *       try {
 *         const result = await solicitudesApi.misSolicitudes({
 *           pagina: 1,
 *           limite: 10
 *         })
 *         solicitudes.value = result.data
 *       } catch (err) {
 *         errorMessage.value = '❌ Error al cargar solicitudes'
 *         console.error(err)
 *       } finally {
 *         loading.value = false
 *       }
 *     }
 * 
 *     onMounted(cargarSolicitudes)
 * 
 *     return { solicitudes, loading, errorMessage, cargarSolicitudes }
 *   }
 * }
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 5️⃣  MANEJO DE ERRORES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Los errores se normalizan automáticamente (httpClient.ts)
 * 
 * Estructura de error:
 * {
 *   message: string
 *   statusCode?: number
 *   field?: string
 * }
 * 
 * Ejemplo:
 * 
 * try {
 *   await usuariosApi.crear({ nombre_completo: '' })
 * } catch (error: any) {
 *   console.error('💬 Mensaje:', error.message)
 *   console.error('🔢 Código:', error.statusCode)
 * }
 * 
 * 401 (Token expirado) -> ✅ Automáticamente redirige a /login
 * 403 (No autorizado) -> Mostrar error
 * 500 (Error servidor) -> Mostrar error genérico
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 6️⃣  PROTECCIÓN POR ROL CON ROUTER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El router.beforeEach() está configurado para:
 * 
 * ✅ Ruta /dashboard -> requiere rol 'Estudiante'
 * ✅ Ruta /secretaria -> requiere rol 'Secretaria'
 * ✅ Ruta /admin -> requiere rol 'Administrador'
 * 
 * Si intentas acceder con rol incorrecto:
 * -> ❌ Acceso denegado
 * -> 🔀 Redirige a tu dashboard correcto
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 7️⃣  UTILIDADES DE AYUDA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * import { authApi } from '@/api'
 * 
 * // Obtener rol actual
 * const rol = authApi.getCurrentRole()
 * console.log('👤 Tu rol:', rol)
 * // 'Administrador', 'Secretaria', 'Estudiante'
 * 
 * // Obtener datos del usuario actual
 * const usuario = authApi.getCurrentUser()
 * console.log('👤 Usuario:', usuario)
 * console.log('📧 Email:', usuario?.email)
 * console.log('🎓 Carrera:', usuario?.carrera)
 * 
 * // Verificar si está autenticado
 * const autenticado = authApi.isAuthenticated()
 * 
 * // Logout
 * authApi.logout()
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  TIPS IMPORTANTES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. El token se GUARDA automáticamente en login
 *    - localStorage.getItem('auth_token') ✅
 *    - Se envía automáticamente en Authorization header ✅
 * 
 * 2. El rol se GUARDA con el usuario
 *    - localStorage.getItem('auth_student') → contiene rol ✅
 *    - El router protege rutas automáticamente ✅
 * 
 * 3. Si el token expira:
 *    - El interceptor detecta 401 ✅
 *    - Limpia todo automáticamente ✅
 *    - Redirige a /login ✅
 * 
 * 4. Los errores están normalizados:
 *    - error.message → mensaje legible ✅
 *    - error.statusCode → código HTTP ✅
 *    - error.field → qué campo tiene error (si aplica) ✅
 * 
 * 5. NUEVAS FUNCIONES DISPONIBLES:
 *    - authApi.getCurrentRole() → obtener rol actual
 *    - authApi.getCurrentUser() → obtener usuario actual
 *    - authApi.isAuthenticated() → verificar autenticación
 *    - authApi.logout() → cerrar sesión
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export {}


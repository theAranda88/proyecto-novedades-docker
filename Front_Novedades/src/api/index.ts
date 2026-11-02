/**
 * 📡 CONFIGURACIÓN CENTRALIZADA DE API
 * 
 * Este módulo exporta:
 * 1. La instancia de axios configurada (http)
 * 2. Todos los servicios de la aplicación
 * 
 * Incluye automáticamente:
 * ✅ Token en cada request (interceptor request)
 * ✅ Manejo de errores 401 (interceptor response)
 * ✅ Normalización de respuestas de error
 * 
 * ESTRUCTURA:
 * - http: Instancia axios configurada
 * - authApi: Login, cambiar contraseña, logout
 * - usuariosApi: Gestionar usuarios (ADMIN)
 * - solicitudesApi: Gestionar solicitudes
 * - services: Legacy services (compatibilidad)
 */

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTAR INSTANCIA HTTP CONFIGURADA
// ═══════════════════════════════════════════════════════════════════════════
export { default as http } from '../utils/httpClient'

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTAR NUEVAS APIS CONSOLIDADAS
// ═══════════════════════════════════════════════════════════════════════════
export { default as authApi } from './auth'
export { default as usuariosApi } from './usuarios'
export { default as solicitudesApi } from './solicitudes'

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTAR SERVICIOS LEGACY (para compatibilidad con código existente)
// ═══════════════════════════════════════════════════════════════════════════
export { default as authService } from '../services/authService'
export { default as usuariosService } from '../services/usuariosService'
export { default as estudianteService } from '../services/estudianteService'
export { default as solicitudesService } from '../services/solicitudesService'
export { default as grupoService } from '../services/grupoService'
export { default as adminService } from '../services/adminService'
export { default as notificacionesService } from '../services/notificacionesService'

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTAR TIPOS
// ═══════════════════════════════════════════════════════════════════════════
export type {
  LoginPayload,
  LoginResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  StudentInfo,
  User,
} from '../types'


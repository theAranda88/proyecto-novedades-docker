/**
 * 📋 SERVICIOS DE USUARIOS
 * 
 * Métodos para gestionar usuarios del sistema:
 * - Listar usuarios con paginación y filtros
 * - Buscar usuarios por nombre, email o código
 * - Crear, actualizar, desactivar y reactivar usuarios
 * - Gestionar estado de matrícula
 */

import http from '../utils/httpClient'

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════

interface UsuarioResponse {
  id: number
  nombre_completo: string
  email_institucional?: string
  rol: string
  codigo_estudiantil?: string
  activo: boolean
  carrera?: string
  programa?: string
  semestre?: number
  promedio?: string
}

interface CreateUsuarioPayload {
  nombre_completo: string
  codigo_estudiantil?: string
  email_institucional?: string
  rol: 'ADMIN' | 'SECRETARIA' | 'ESTUDIANTE'
  carrera?: string
  programa?: string
  semestre?: number
}

interface UpdateUsuarioPayload {
  nombre_completo?: string
  email_institucional?: string
  carrera?: string
  programa?: string
  semestre?: number
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS DE USUARIOS
// ═══════════════════════════════════════════════════════════════════════════

const usuariosApi = {
  /**
   * 📋 Listar todos los usuarios con paginación y filtros
   * @param params - Parámetros de filtrado: pagina, limite, rol, activo, search
   */
  async getUsuarios(params?: {
    pagina?: number
    limite?: number
    rol?: 'ADMIN' | 'SECRETARIA' | 'ESTUDIANTE'
    activo?: boolean
    search?: string
  }) {
    const { data } = await http.get('/usuarios', { params })
    return data as { data: UsuarioResponse[]; total: number }
  },

  /**
   * 🔍 Buscar usuarios por nombre, email o código
   * @param q - Término de búsqueda
   */
  async buscar(q: string) {
    const { data } = await http.get('/usuarios/buscar', {
      params: { q }
    })
    return data as UsuarioResponse[]
  },

  /**
   * 👤 Obtener usuario por ID
   * @param id - ID del usuario
   */
  async getById(id: number) {
    const { data } = await http.get(`/usuarios/${id}`)
    return data as UsuarioResponse
  },

  /**
   * ✏️ Actualizar datos del usuario
   * @param id - ID del usuario
   * @param payload - Datos a actualizar
   */
  async actualizar(id: number, payload: UpdateUsuarioPayload) {
    const { data } = await http.put(`/usuarios/${id}`, payload)
    return data as UsuarioResponse
  },

  /**
   * ✅ Crear nuevo usuario (solo ADMIN)
   * @param payload - Datos del nuevo usuario
   */
  async crear(payload: CreateUsuarioPayload) {
    const { data } = await http.post('/usuarios', payload)
    return data as UsuarioResponse
  },

  /**
   * ❌ Desactivar usuario
   * @param id - ID del usuario
   */
  async desactivar(id: number) {
    const { data } = await http.put(`/usuarios/${id}/desactivar`)
    return data as UsuarioResponse
  },

  /**
   * ✅ Reactivar usuario (solo ADMIN)
   * @param id - ID del usuario
   */
  async reactivar(id: number) {
    const { data } = await http.put(`/usuarios/${id}/reactivar`)
    return data as UsuarioResponse
  },

  /**
   * 🎓 Cambiar estado de matrícula de estudiante
   * @param id - ID del estudiante
   * @param matricula_activa - True para activar, false para desactivar
   */
  async cambiarMatricula(id: number, matricula_activa: boolean) {
    const { data } = await http.put(`/usuarios/${id}/estado-matricula`, {
      matricula_activa
    })
    return data as UsuarioResponse
  },

  /**
   * 📊 Obtener estadísticas de usuarios
   * Solo ADMIN
   */
  async obtenerEstadisticas() {
    const { data } = await http.get('/usuarios/estadisticas')
    return data as {
      total_usuarios: number
      estudiantes: number
      secretarias: number
      administradores: number
      activos: number
      inactivos: number
    }
  },
}

export default usuariosApi

/**
 *  SERVICIOS DE AUTENTICACIÓN
 * 
 * El token se gestiona automáticamente:
 *  Se guarda en localStorage después del login
 *  Se envía automáticamente en cada request (interceptor)
 *  Si expira (401), automáticamente redirige a /login
 */

import http from '../utils/httpClient'
import type { LoginPayload, LoginResponse, ChangePasswordPayload, RolUsuario } from '../types'

interface BackendLoginResponse {
  ok: boolean
  mensaje: string
  datos: {
    id_usuario: number
    nombre_completo: string
    token: string
    primer_login: boolean
    rol: string
    codigo_estudiantil?: string
    carrera?: string
    programa?: string
    nombre_programa?: string
    semestre?: number
    email?: string
    email_institucional?: string
    jornada?: string
    creditos_inscritos?: number
    creditos_max_permitidos?: number
    estado_academico?: string
    matricula_activa?: boolean
    promedio?: string | number
    avatarUrl?: string
  }
  codigo_estado: number
}

/**
 * Normalizar rol para asegurar consistencia en toda la app
 */
function normalizeRole(rol: string): RolUsuario {
  const rolMap: Record<string, RolUsuario> = {
    'ADMIN': 'Administrador',
    'ADMINISTRADOR': 'Administrador',
    'SECRETARIA': 'Secretaria',
    'ESTUDIANTE': 'Estudiante',
    'admin': 'Administrador',
    'administrador': 'Administrador',
    'secretaria': 'Secretaria',
    'estudiante': 'Estudiante',
  }
  return rolMap[rol?.trim() || ''] || 'Estudiante'
}

const authApi = {
  /**
   * 🔐 LOGIN - Inicia sesión con correo institucional + contraseña
   *
   * @param payload - { correo, password }
   * @returns Token y datos del usuario
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const sendPayload = {
      correo: payload.correo.trim().toLowerCase(),
      password: payload.password,
    }

    console.log('📤 Enviando login con:', sendPayload)
    const { data } = await http.post<BackendLoginResponse>('/auth/login', sendPayload)

    if (!data?.datos) {
      throw new Error(data?.mensaje || 'Respuesta inválida del backend')
    }

    const normalizedRol = normalizeRole(data.datos.rol)

    const result: LoginResponse = {
      token: data.datos.token,
      student: {
        id: String(data.datos.id_usuario),
        nombre: data.datos.nombre_completo,
        nombre_completo: data.datos.nombre_completo,
        codigo: data.datos.codigo_estudiantil || '',
        cod_alumno: data.datos.codigo_estudiantil,
        rol: normalizedRol,
        carrera: data.datos.carrera || '',
        programa: data.datos.programa,
        email: data.datos.email,
        email_institucional: data.datos.email_institucional,
        semestre: data.datos.semestre,
        jornada: data.datos.jornada,
        creditos_inscritos: data.datos.creditos_inscritos,
        creditos_max_permitidos: data.datos.creditos_max_permitidos,
        estado_academico: data.datos.estado_academico,
        matricula_activa: data.datos.matricula_activa,
        promedio: data.datos.promedio,
        avatarUrl: data.datos.avatarUrl,
      },
      requiresPasswordChange: !!data.datos.primer_login,
    }

    return result
  },

  /**
   * 🔐 LOGIN CON GOOGLE - recibe el id_token de Google Identity Services
   */
  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const { data } = await http.post<BackendLoginResponse>('/auth/google', {
      id_token: idToken,
    })

    if (!data?.datos) {
      throw new Error(data?.mensaje || 'No se pudo iniciar sesión con Google')
    }

    const normalizedRol = normalizeRole(data.datos.rol)

    return {
      token: data.datos.token,
      student: {
        id: String(data.datos.id_usuario),
        nombre: data.datos.nombre_completo,
        nombre_completo: data.datos.nombre_completo,
        codigo: data.datos.codigo_estudiantil || '',
        cod_alumno: data.datos.codigo_estudiantil,
        rol: normalizedRol,
        carrera: data.datos.carrera || '',
        programa: data.datos.programa,
        email: data.datos.email,
        email_institucional: data.datos.email_institucional,
        semestre: data.datos.semestre,
        jornada: data.datos.jornada,
        creditos_inscritos: data.datos.creditos_inscritos,
        creditos_max_permitidos: data.datos.creditos_max_permitidos,
        estado_academico: data.datos.estado_academico,
        matricula_activa: data.datos.matricula_activa,
        promedio: data.datos.promedio,
        avatarUrl: data.datos.avatarUrl,
      },
      requiresPasswordChange: !!data.datos.primer_login,
    }
  },

  /**
   * 🔑 CAMBIAR CONTRASEÑA - Solo para primer login
   */
  async changePassword(payload: ChangePasswordPayload): Promise<LoginResponse> {
    const { data } = await http.post<BackendLoginResponse>('/auth/change-password', payload)

    const normalizedRol = normalizeRole(data.datos.rol)

    return {
      token: data.datos.token,
      student: {
        id: String(data.datos.id_usuario),
        nombre: data.datos.nombre_completo,
        nombre_completo: data.datos.nombre_completo,
        codigo: data.datos.codigo_estudiantil || '',
        cod_alumno: data.datos.codigo_estudiantil,
        rol: normalizedRol,
        carrera: data.datos.carrera || '',
        programa: data.datos.programa,
        email: data.datos.email,
        email_institucional: data.datos.email_institucional,
        semestre: data.datos.semestre,
        jornada: data.datos.jornada,
        creditos_inscritos: data.datos.creditos_inscritos,
        creditos_max_permitidos: data.datos.creditos_max_permitidos,
        estado_academico: data.datos.estado_academico,
        matricula_activa: data.datos.matricula_activa,
        promedio: data.datos.promedio,
        avatarUrl: data.datos.avatarUrl,
      },
      requiresPasswordChange: false,
    }
  },

  /**
   * 🔐 RECUPERAR CONTRASEÑA - Inicia el flujo de recuperación
   * 
   * @param codigoEstudiantil - Código del estudiante
   * @returns Mensaje genérico (sin revelar si el código existe o no)
   */
  async forgotPassword(codigoEstudiantil: string): Promise<{ mensaje: string }> {
    const { data } = await http.post<{ ok: boolean; mensaje: string }>('/auth/forgot-password', {
      codigo_estudiantil: codigoEstudiantil
    })
    
    return { mensaje: data.mensaje }
  },

  /**
   * 🚪 LOGOUT - Limpia todo
   */
  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_student')
    localStorage.removeItem('primer_login')
  },

  /**
   * ✅ Verifcar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  },

  /**
   * 👤 Obtener rol del usuario actual
   */
  getCurrentRole(): string | null {
    const studentData = localStorage.getItem('auth_student')
    if (!studentData) return null
    try {
      const student = JSON.parse(studentData)
      return student.rol || null
    } catch {
      return null
    }
  },

  /**
   * 👤 Obtener datos del usuario actual
   */
  getCurrentUser() {
    const studentData = localStorage.getItem('auth_student')
    if (!studentData) return null
    try {
      return JSON.parse(studentData)
    } catch {
      return null
    }
  },
}

export default authApi

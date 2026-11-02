import http from '../utils/httpClient'
import type { UsuarioAdmin, CreateUsuarioPayload } from '../types'

type BackendUsuario = Record<string, any>

interface CrearUsuarioResult {
  usuario: UsuarioAdmin
  mensaje: string
  contrasena_temporal?: string
  mensaje_contrasena?: string
  primer_login?: boolean
}

interface BackendEnvelope<T> {
  ok?: boolean
  mensaje?: string
  datos: T
  codigo_estado?: number
}

function getBackendDataOrThrow<T>(response: BackendEnvelope<T>): T {
  if (response?.ok === false) {
    const error = new Error(response.mensaje || 'Error en la operación de usuarios.') as Error & {
      statusCode?: number
    }
    error.statusCode = response.codigo_estado
    throw error
  }

  return response?.datos as T
}

function normalizeRole(rol: string): UsuarioAdmin['rol'] {
  const rolMap: Record<string, UsuarioAdmin['rol']> = {
    ADMIN: 'Administrador',
    ADMINISTRADOR: 'Administrador',
    SECRETARIA: 'Secretaria',
    ESTUDIANTE: 'Estudiante',
    DOCENTE: 'Docente',
    admin: 'Administrador',
    administrador: 'Administrador',
    secretaria: 'Secretaria',
    estudiante: 'Estudiante',
    docente: 'Docente',
  }

  return rolMap[rol?.trim() || ''] || 'Estudiante'
}

function normalizeEstado(raw: BackendUsuario): UsuarioAdmin['estado'] {
  if (raw.estado === 'Activo' || raw.estado === 'Inactivo' || raw.estado === 'Suspension') {
    return raw.estado
  }

  if (typeof raw.activo === 'boolean') {
    return raw.activo ? 'Activo' : 'Inactivo'
  }

  return 'Activo'
}

function mapBackendUsuario(raw: BackendUsuario): UsuarioAdmin {
  const estado = normalizeEstado(raw)
  const id = raw.id ?? raw.id_usuario ?? 0

  return {
    id: Number(id),
    nombre: raw.nombre || raw.nombre_completo || '',
    nombre_completo: raw.nombre_completo || raw.nombre || '',
    email: raw.email || raw.email_institucional || '',
    email_institucional: raw.email_institucional || raw.email,
    rol: normalizeRole(raw.rol),
    codigo_estudiantil: raw.codigo_estudiantil,
    codigo_institucional: raw.codigo_institucional,
    activo: estado === 'Activo',
    estado,
    carrera: raw.carrera,
    programa: raw.programa,
    semestre: raw.semestre,
    promedio: raw.promedio,
    avatarUrl: raw.avatarUrl,
    idInstitucional: raw.codigo_institucional || raw.codigo_estudiantil,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface ListarUsuariosParams {
  pagina?: number
  limite?: number
  rol?: string
  activo?: boolean
}

export interface ListarUsuariosResponse {
  usuarios: UsuarioAdmin[]
  total: number
  pagina?: number
  limite?: number
}

export interface ActualizarUsuarioPayload {
  nombre_completo?: string
  email_institucional?: string
}

export interface BuscarUsuariosResponse {
  resultados: UsuarioAdmin[]
  cantidad: number
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════════════════════════════════════

const usuariosService = {
  /**
   * GET /api/usuarios
   * Lista usuarios con filtros y paginación
   * Acceso: ADMIN (todos) o SECRETARIA (solo estudiantes)
   * 
   * Response: { usuarios, total, pagina, limite }
   */
  async listarUsuarios(params?: ListarUsuariosParams): Promise<ListarUsuariosResponse> {
    try {
      // Normalizar rol si viene en los parámetros
      const paramsEnvio = { ...params }
      if (paramsEnvio.rol) {
        const rolMap: Record<string, string> = {
          'Administrador': 'ADMIN',
          'Secretaria': 'SECRETARIA',
          'Estudiante': 'ESTUDIANTE',
        }
        paramsEnvio.rol = rolMap[paramsEnvio.rol] || paramsEnvio.rol.toUpperCase()
      }
      
      const { data } = await http.get<BackendEnvelope<any>>('/usuarios', { params: paramsEnvio })
      // El backend devuelve: { ok, mensaje, datos: { usuarios, total, pagina, limite }, codigo_estado }
      const datos = getBackendDataOrThrow(data) || { usuarios: [], total: 0 }

      return {
        ...datos,
        usuarios: Array.isArray(datos.usuarios)
          ? datos.usuarios.map((u: BackendUsuario) => mapBackendUsuario(u))
          : [],
      }
    } catch (error) {
      console.error('❌ Error listando usuarios:', error)
      throw error
    }
  },

  /**
   * GET /api/usuarios/buscar?q=termino
   * Busca usuarios por nombre, email o código
   * Acceso: ADMIN (todos) o SECRETARIA (solo estudiantes)
   * 
   * Response: { resultados, cantidad }
   */
  async buscarUsuarios(q: string, limite?: number): Promise<BuscarUsuariosResponse> {
    try {
      const { data } = await http.get<BackendEnvelope<any>>('/usuarios/buscar', {
        params: { q, limite }
      })
      // El backend devuelve: { ok, mensaje, datos: { resultados, cantidad }, codigo_estado }
      const datos = getBackendDataOrThrow(data) || { resultados: [], cantidad: 0 }

      return {
        ...datos,
        resultados: Array.isArray(datos.resultados)
          ? datos.resultados.map((u: BackendUsuario) => mapBackendUsuario(u))
          : [],
      }
    } catch (error) {
      console.error('❌ Error buscando usuarios:', error)
      throw error
    }
  },

  /**
   * GET /api/usuarios/:id
   * Obtiene un usuario completo por ID
   * Acceso: ADMIN (cualquier usuario) o SECRETARIA (solo estudiantes)
   * 
   * Response: UsuarioAdmin completo
   */
  async obtenerUsuario(id: number): Promise<UsuarioAdmin> {
    try {
      const { data } = await http.get<BackendEnvelope<any>>(`/usuarios/${id}`)
      // El backend devuelve: { ok, mensaje, datos: UsuarioAdmin, codigo_estado }
      return mapBackendUsuario(getBackendDataOrThrow(data))
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error)
      throw error
    }
  },

  /**
   * PUT /api/usuarios/:id
   * Actualiza datos básicos de un usuario (nombre, email)
   * Acceso: ADMIN (cualquier usuario) o SECRETARIA (solo estudiantes)
   * 
   * Response: { id_usuario }
   */
  async actualizarUsuario(id: number, payload: ActualizarUsuarioPayload): Promise<{ id_usuario: number }> {
    try {
      const { data } = await http.put<BackendEnvelope<any>>(`/usuarios/${id}`, payload)
      // El backend devuelve: { ok, mensaje, datos: { id_usuario }, codigo_estado }
      return getBackendDataOrThrow(data) || { id_usuario: id }
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error)
      throw error
    }
  },

  /**
   * POST /api/usuarios
   * Crea un nuevo usuario en el sistema
   * Acceso: ADMIN (puede crear ADMIN, SECRETARIA, ESTUDIANTE)
   *         SECRETARIA (puede crear ESTUDIANTE)
   * 
   * Response: { id_usuario, nombre_completo, email_institucional, password_temporal, rol, ... }
   * La contraseña temporal se devuelve UNA SOLA VEZ
   * Backend envuelve en: { ok, mensaje, datos: {..., password_temporal}, codigo_estado: 201 }
   */
  async crearUsuario(payload: CreateUsuarioPayload): Promise<CrearUsuarioResult> {
    try {
      // Normalizar rol del frontend (español) a backend (MAYÚSCULA)
      const rolMap: Record<string, string> = {
        'Administrador': 'ADMIN',
        'Secretaria': 'SECRETARIA',
        'Estudiante': 'ESTUDIANTE',
        'ADMIN': 'ADMIN',
        'SECRETARIA': 'SECRETARIA',
        'ESTUDIANTE': 'ESTUDIANTE',
      }
      
      const payloadEnvio = {
        ...payload,
        rol: rolMap[payload.rol] || payload.rol.toUpperCase()
      }
      
      console.log('📤 Enviando crear usuario:', payloadEnvio)
      const { data } = await http.post<BackendEnvelope<any>>('/usuarios', payloadEnvio)
      // El backend devuelve: { ok, mensaje, datos: { ...usuario, contrasena_temporal }, codigo_estado: 201 }
      const datos = getBackendDataOrThrow(data)
      console.log('✅ Usuario creado:', datos)

      return {
        usuario: mapBackendUsuario(datos || {}),
        mensaje: data.mensaje || 'Usuario creado correctamente.',
        contrasena_temporal: datos?.contrasena_temporal || datos?.password_temporal,
        mensaje_contrasena: datos?.mensaje_contrasena,
        primer_login: datos?.primer_login,
      }
    } catch (error) {
      console.error('❌ Error creando usuario:', error)
      throw error
    }
  },

  /**
   * GET /api/usuarios/roles-permitidos
   * Obtiene la lista de roles que el usuario autenticado puede crear
   * Usado para poblr opciones válidas en formularios de creación
   * 
   * Response: { rol_usuario_autenticado, roles_que_puede_crear, puede_crear_usuarios }
   * Backend envuelve en: { ok, mensaje, datos: {...}, codigo_estado: 200 }
   */
  async obtenerRolesPermitidos(): Promise<{ rol_usuario_autenticado: string; roles_que_puede_crear: string[]; puede_crear_usuarios: boolean }> {
    try {
      const { data } = await http.get<BackendEnvelope<any>>('/usuarios/roles-permitidos')
      // El backend devuelve: { ok, mensaje, datos: { rol_usuario_autenticado, roles_que_puede_crear, puede_crear_usuarios }, codigo_estado }
      return getBackendDataOrThrow(data)
    } catch (error) {
      console.error('❌ Error obteniendo roles permitidos:', error)
      throw error
    }
  },

  /**
   * GET /api/usuarios/estadisticas
   * Obtiene las estadísticas de usuarios
   * Acceso: ADMIN
   * 
   * Response: { total_usuarios, activos, inactivos, estudiantes, secretarias, administradores }
   */
  async obtenerEstadisticas(): Promise<{ total_usuarios: number; activos: number; inactivos: number; estudiantes: number; secretarias: number; administradores: number }> {
    try {
      const { data } = await http.get<BackendEnvelope<any>>('/usuarios/estadisticas')
      // El backend devuelve: { ok, mensaje, datos: { total_usuarios, activos, ... }, codigo_estado }
      return getBackendDataOrThrow(data)
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de usuarios:', error)
      return { total_usuarios: 0, activos: 0, inactivos: 0, estudiantes: 0, secretarias: 0, administradores: 0 }
    }
  },

  /**
   * PUT /api/usuarios/:id/desactivar
   * Desactiva un usuario (no puede acceder al sistema)
   * Acceso: ADMIN (cualquier usuario) o SECRETARIA (solo estudiantes)
   * 
   * Response: { id_usuario, activo: false }
   */
  async desactivarUsuario(id: number): Promise<{ id_usuario: number; activo: boolean }> {
    try {
      const { data } = await http.put<BackendEnvelope<any>>(`/usuarios/${id}/desactivar`)
      // El backend devuelve: { ok, mensaje, datos: { id_usuario, activo: false }, codigo_estado }
      return getBackendDataOrThrow(data) || { id_usuario: id, activo: false }
    } catch (error) {
      console.error('❌ Error desactivando usuario:', error)
      throw error
    }
  },

  /**
   * PUT /api/usuarios/:id/reactivar
   * Reactiva un usuario desactivado
   * Acceso: Solo ADMIN
   * 
   * Response: { id_usuario, activo: true }
   */
  async reactivarUsuario(id: number): Promise<{ id_usuario: number; activo: boolean }> {
    try {
      const { data } = await http.put<BackendEnvelope<any>>(`/usuarios/${id}/reactivar`)
      // El backend devuelve: { ok, mensaje, datos: { id_usuario, activo: true }, codigo_estado }
      return getBackendDataOrThrow(data) || { id_usuario: id, activo: true }
    } catch (error) {
      console.error('❌ Error reactivando usuario:', error)
      throw error
    }
  },

  /**
   * PUT /api/usuarios/:id/estado-matricula
   * Actualiza el estado de matrícula de un estudiante
   * Acceso: ADMIN o SECRETARIA (solo estudiantes)
   * 
   * Request: { matricula_activa: true/false }
   * Response: { id_usuario, matricula_activa }
   */
  async cambiarEstadoMatricula(id: number, matricula_activa: boolean): Promise<{ id_usuario: number; matricula_activa: boolean }> {
    try {
      const { data } = await http.put<BackendEnvelope<any>>(`/usuarios/${id}/estado-matricula`, {
        matricula_activa
      })
      // El backend devuelve: { ok, mensaje, datos: { id_usuario, matricula_activa }, codigo_estado }
      return getBackendDataOrThrow(data) || { id_usuario: id, matricula_activa }
    } catch (error) {
      console.error('❌ Error actualizando estado de matrícula:', error)
      throw error
    }
  },

  // ─── Métodos heredados para compatibilidad ─────────────────────────────

  /**
   * @deprecated Usar listarUsuarios()
   */
  async getUsuarios(params?: ListarUsuariosParams): Promise<ListarUsuariosResponse> {
    return this.listarUsuarios(params)
  },

  /**
   * @deprecated Usar buscarUsuarios()
   */
  async buscar(q: string): Promise<any> {
    const resultado = await this.buscarUsuarios(q)
    return resultado
  },

  /**
   * @deprecated Usar obtenerUsuario()
   */
  async getById(id: number): Promise<UsuarioAdmin> {
    return this.obtenerUsuario(id)
  },

  /**
   * @deprecated Usar actualizarUsuario()
   */
  async actualizar(id: number, payload: ActualizarUsuarioPayload): Promise<any> {
    return this.actualizarUsuario(id, payload)
  },

  /**
   * @deprecated Usar crearUsuario()
   */
  async crear(payload: CreateUsuarioPayload): Promise<UsuarioAdmin> {
    const result = await this.crearUsuario(payload)
    return result.usuario
  },

  /**
   * @deprecated Usar desactivarUsuario()
   */
  async desactivar(id: number): Promise<any> {
    return this.desactivarUsuario(id)
  },

  /**
   * @deprecated Usar reactivarUsuario()
   */
  async reactivar(id: number): Promise<any> {
    return this.reactivarUsuario(id)
  },

  /**
   * @deprecated Usar cambiarEstadoMatricula()
   */
  async cambiarMatricula(id: number, matricula_activa: boolean): Promise<any> {
    return this.cambiarEstadoMatricula(id, matricula_activa)
  }
}

export default usuariosService

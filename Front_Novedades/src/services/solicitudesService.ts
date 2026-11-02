import http from '../utils/httpClient'
import type { Solicitud, SolicitudCreada } from '../types'

export const QUICK_ACTIONS = [
  { id: 'cambio_grupo', label: 'Cambio de Grupo', icon: 'swap', type: 'solicitud', emoji: '🔄' },
  { id: 'cambio_carrera', label: 'Cambio de Carrera', icon: 'graduation-cap', type: 'solicitud', emoji: '🎓' },
  { id: 'certificado', label: 'Certificado', icon: 'document', type: 'documento', emoji: '📄' },
  { id: 'historial', label: 'Historial Académico', icon: 'history', type: 'consulta', emoji: '📊' },
]

/**
 * Convierte un File a base64
 */
function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Extraer solo la parte base64 (sin el data URI prefix)
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(archivo)
  })
}

const solicitudesService = {
  /**
   * GET /api/solicitudes/mias
   * Lista las solicitudes del estudiante autenticado
   * Soporta filtros: ?estado, ?periodo
   * 
   * Response: array de Solicitud
   * Backend envuelve en: { ok, mensaje, datos: [...], codigo_estado }
   */
  async getMisSolicitudes(filtros?: { estado?: string; periodo?: string }): Promise<Solicitud[]> {
    try {
      const { data } = await http.get<any>('/solicitudes/mias', { params: filtros })
      // El backend devuelve: { ok, mensaje, datos: [...], codigo_estado }
      return data.datos || []
    } catch (error) {
      console.error('❌ Error obteniendo mis solicitudes:', error)
      return []
    }
  },

  /**
   * GET /api/solicitudes/:id
   * Obtiene detalles completos de una solicitud específica
   * 
   * Response: Solicitud completa
   * Backend envuelve en: { ok, mensaje, datos: {...}, codigo_estado }
   */
  async getDetalle(id: string): Promise<Solicitud> {
    try {
      const { data } = await http.get<any>(`/solicitudes/${id}`)
      // El backend devuelve: { ok, mensaje, datos: {...}, codigo_estado }
      return data.datos
    } catch (error) {
      console.error('❌ Error obteniendo detalle de solicitud:', error)
      throw error
    }
  },

  /**
   * POST /api/solicitudes
   * Crea una nueva solicitud de novedad académica
   * Si se incluyen archivos, se convierten a base64
   * 
   * El backend espera (TDatosSolicitud):
   *   tipo_solicitud: 'cambio_curso'|'cambio_jornada'|'adicion_curso'|'curso_dirigido'
   *   periodo_academico: string (ej: '2026-1')
   *   justificacion: string
   *   grupo_actual_id?: number
   *   grupo_nuevo_id?: number
   *   jornada_actual?: string
   *   jornada_nueva?: string
   * 
   * El idUsuario, estudianteSeq y codAlumno se toman del JWT en el backend.
   * 
   * Response: La solicitud creada con validacion_json
   * Backend envuelve en: { ok, mensaje, datos: {...}, codigo_estado: 201 }
   */
  async crear(payload: Record<string, any>, archivos?: File[]): Promise<SolicitudCreada> {
    try {
      const payloadEnvio: Record<string, any> = { ...payload }
      
      // Procesar archivos si existen
      if (archivos && archivos.length > 0) {
        const archivo = archivos[0] // Tomar el primer archivo
        const base64 = await archivoABase64(archivo)
        payloadEnvio.adjunto_base64 = base64
        payloadEnvio.nombre_adjunto = archivo.name
      }

      console.log('📤 Enviando solicitud a /api/solicitudes:', payloadEnvio)
      const { data } = await http.post<any>('/solicitudes', payloadEnvio)
      
      console.log('✅ Respuesta del backend:', data)
      // El backend devuelve: { ok, mensaje, datos: { id, tipo, estado, ..., validacion_json }, codigo_estado: 201 }
      return data.datos
    } catch (err: any) {
      console.error('❌ Error en POST /solicitudes:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      })
      throw err
    }
  },

  /**
   * GET /api/solicitudes
   * Lista TODAS las solicitudes del sistema
   * Acceso: SECRETARIA, ADMIN
   * Soporta filtros: ?estado, ?periodo, ?tipo_solicitud
   * 
   * Response: array de Solicitud
   * Backend envuelve en: { ok, mensaje, datos: [...], codigo_estado }
   */
  async obtenerSolicitudes(params?: {
    estado?: string
    periodo?: string
    tipo_solicitud?: string
  }): Promise<Solicitud[]> {
    try {
      const { data } = await http.get<any>('/solicitudes', { params })
      // El backend devuelve: { ok, mensaje, datos: [...], codigo_estado }
      return data.datos || []
    } catch (error) {
      console.error('❌ Error obteniendo todas las solicitudes:', error)
      return []
    }
  },

  /**
   * PATCH /api/solicitudes/:id/estado
   * Actualiza el estado de una solicitud (en_revision, aprobada, rechazada)
   * Acceso: SECRETARIA, ADMIN
   * 
   * El backend resuelve aprobadaPor desde el JWT.
   * 
   * Response: null (200 OK)
   * Backend envuelve en: { ok, mensaje, datos: null, codigo_estado: 200 }
   */
  async actualizarEstado(
    id: string | number,
    payload: { estado: string; observaciones?: string }
  ): Promise<void> {
    try {
      const { data } = await http.patch<any>(`/solicitudes/${id}/estado`, payload)
      // El backend devuelve: { ok, mensaje, datos: null, codigo_estado }
      console.log('✅ Estado actualizado:', data)
      return data.datos
    } catch (error) {
      console.error('❌ Error actualizando estado de solicitud:', error)
      throw error
    }
  },

  /**
   * @deprecated Usar actualizarEstado()
   */
  async cancelar(id: string): Promise<Solicitud> {
    try {
      const { data } = await http.put<any>(`/solicitudes/${id}/cancelar`)
      return data.datos
    } catch (error) {
      console.error('❌ Error cancelando solicitud:', error)
      throw error
    }
  },
}

export default solicitudesService
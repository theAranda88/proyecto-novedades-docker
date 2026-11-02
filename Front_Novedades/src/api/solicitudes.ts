/**
 * 📝 SERVICIOS DE SOLICITUDES
 * 
 * Métodos para gestionar solicitudes de trayectorias:
 * - Listar solicitudes del estudiante
 * - Crear nueva solicitud
 * - Obtener historial
 */

import http from '../utils/httpClient'

interface SolicitudResponse {
  id: number
  id_estudiante: number
  codigo_solicitud: string
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CANCELADA'
  fecha_creacion: string
  fecha_actualizacion: string
  motivo?: string
  detalles?: Record<string, any>
}

const solicitudesApi = {
  /**
   * 📋 Listar mis solicitudes (para estudiante)
   */
  async misSolicitudes(params?: { pagina?: number; limite?: number; estado?: string }) {
    try {
      // Intentar con parámetros en formato correcto
      const queryParams: Record<string, any> = {}
      if (params?.pagina !== undefined) queryParams.page = params.pagina
      if (params?.limite !== undefined) queryParams.limit = params.limite
      if (params?.estado !== undefined) queryParams.estado = params.estado
      
      const { data } = await http.get('/solicitudes/mis-solicitudes', { params: Object.keys(queryParams).length > 0 ? queryParams : undefined })
      return data as { data: SolicitudResponse[]; total: number }
    } catch (error: any) {
      // Si falla con parámetros, intentar sin parámetros
      if (error?.response?.status === 400) {
        console.warn('⚠️ Endpoint no aceptó parámetros, intentando sin ellos...')
        const { data } = await http.get('/solicitudes/mis-solicitudes')
        return data as { data: SolicitudResponse[]; total: number }
      }
      throw error
    }
  },

  /**
   * 📋 Listar todas las solicitudes (para ADMIN/SECRETARIA)
   */
  async obtenerSolicitudes(params?: {
    pagina?: number
    limite?: number
    estado?: string
    id_estudiante?: number
  }) {
    const { data } = await http.get('/solicitudes', { params })
    return data as { data: SolicitudResponse[]; total: number }
  },

  /**
   * 🔍 Obtener detalle de una solicitud
   */
  async obtenerDetalle(id: number) {
    const { data } = await http.get(`/solicitudes/${id}`)
    return data as SolicitudResponse
  },

  /**
   * ✅ Crear nueva solicitud
   * 
   * @param payload - Puede incluir:
   *   - tipo: string (Cambio de Curso, Cambio de Jornada, etc.)
   *   - descripcion: string
   *   - codigo_estudiantil: string
   *   - email_estudiante: string
   *   - nombre_estudiante: string
   *   - Campos específicos según tipo (curso_actual, curso_nuevo, etc.)
   *   - archivos?: File[] (opcional)
   */
  async crear(payload: Record<string, any>) {
    const { data } = await http.post('/solicitudes', payload)
    return data as SolicitudResponse
  },

  /**
   * ✏️ Actualizar estado de solicitud (ADMIN/SECRETARIA)
   */
  async actualizarEstado(
    id: number,
    payload: { estado: 'APROBADA' | 'RECHAZADA' | 'CANCELADA'; observaciones?: string }
  ) {
    const { data } = await http.put(`/solicitudes/${id}`, payload)
    return data as SolicitudResponse
  },

  /**
   * ❌ Cancelar solicitud
   */
  async cancelar(id: number) {
    const { data } = await http.put(`/solicitudes/${id}/cancelar`)
    return data as SolicitudResponse
  },

  /**
   * 📊 Obtener historial
   */
  async obtenerHistorial(params?: { pagina?: number; limite?: number }) {
    const { data } = await http.get('/solicitudes/historial', { params })
    return data as { data: SolicitudResponse[]; total: number }
  },
}

export default solicitudesApi

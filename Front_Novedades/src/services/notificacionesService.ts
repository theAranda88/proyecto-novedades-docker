import http from '../utils/httpClient'
import type {
  Notificacion,
  NotificacionesPaginadas,
  EstadisticasNotificacionesNoLeidas,
} from '../types'

interface BackendEnvelope<T> {
  ok?: boolean
  mensaje?: string
  datos?: T
  codigo_estado?: number
}

function extractData<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'datos' in payload) {
    return (payload as BackendEnvelope<T>).datos as T
  }
  return payload as T
}

function normalizeNotificacion(raw: any): Notificacion {
  return {
    id: Number(raw?.id ?? 0),
    usuario_id: Number(raw?.usuario_id ?? 0),
    solicitud_id: raw?.solicitud_id ?? null,
    titulo: raw?.titulo || 'Notificación',
    mensaje: raw?.mensaje || '',
    tipo_notificacion: raw?.tipo_notificacion || 'general',
    canal_envio: raw?.canal_envio,
    leido: Boolean(raw?.leido),
    created_at: raw?.created_at || new Date().toISOString(),
    updated_at: raw?.updated_at,
  }
}

function normalizeArrayPayload(payload: any): Notificacion[] {
  const data = extractData<any>(payload)
  const rows =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.notificaciones) && data.notificaciones) ||
    (Array.isArray(data?.datos) && data.datos) ||
    []

  return rows.map(normalizeNotificacion)
}

const notificacionesService = {
  async obtenerNoLeidas(limite: number = 20): Promise<Notificacion[]> {
    const { data } = await http.get('/notificaciones/no-leidas', { params: { limite } })
    return normalizeArrayPayload(data)
  },

  async obtenerPorUsuario(pagina: number = 1, tamanio: number = 10): Promise<NotificacionesPaginadas> {
    const { data } = await http.get('/notificaciones', { params: { pagina, tamanio } })
    const payload = extractData<any>(data)
    const rows = Array.isArray(payload?.datos) ? payload.datos : []
    return {
      datos: rows.map(normalizeNotificacion),
      total: Number(payload?.total ?? rows.length),
    }
  },

  async marcarComoLeida(id: number): Promise<void> {
    await http.patch(`/notificaciones/${id}/leer`)
  },

  async marcarTodasComoLeidas(): Promise<number> {
    const { data } = await http.patch('/notificaciones/marcar-todas-leidas')
    const payload = extractData<any>(data)
    return Number(payload?.cantidad_marcadas ?? 0)
  },

  async obtenerEstadisticasNoLeidas(): Promise<EstadisticasNotificacionesNoLeidas> {
    const { data } = await http.get('/notificaciones/estadisticas')
    const payload = extractData<any>(data) || {}
    return {
      total: Number(payload.total ?? 0),
      por_tipo: payload.por_tipo || {},
    }
  },
}

export default notificacionesService
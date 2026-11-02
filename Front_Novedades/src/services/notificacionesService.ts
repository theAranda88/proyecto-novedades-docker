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

function isNotFoundError(error: any): boolean {
  const status = error?.response?.status
  return status === 404 || status === 405
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

async function tryMany<T>(requests: Array<() => Promise<T>>): Promise<T> {
  let lastError: any = null

  for (const request of requests) {
    try {
      return await request()
    } catch (error) {
      lastError = error
      if (!isNotFoundError(error)) {
        throw error
      }
    }
  }

  throw lastError
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
    return tryMany<Notificacion[]>([
      async () => {
        const { data } = await http.get('/notificaciones/no-leidas', { params: { limite } })
        return normalizeArrayPayload(data)
      },
      async () => {
        const { data } = await http.get('/notificaciones/no-leidas', { params: { limit: limite } })
        return normalizeArrayPayload(data)
      },
      async () => {
        const { data } = await http.get('/notificaciones', {
          params: { leido: false, pagina: 1, tamanio: limite },
        })
        return normalizeArrayPayload(data)
      },
    ])
  },

  async obtenerPorUsuario(pagina: number = 1, tamanio: number = 10): Promise<NotificacionesPaginadas> {
    return tryMany<NotificacionesPaginadas>([
      async () => {
        const { data } = await http.get('/notificaciones', { params: { pagina, tamanio } })
        const payload = extractData<any>(data)
        const rows =
          (Array.isArray(payload?.datos) && payload.datos) ||
          (Array.isArray(payload?.notificaciones) && payload.notificaciones) ||
          []
        const total = Number(payload?.total ?? rows.length)

        return {
          datos: rows.map(normalizeNotificacion),
          total,
        }
      },
      async () => {
        const { data } = await http.get('/notificaciones/listado', { params: { pagina, tamanio } })
        const payload = extractData<any>(data)
        const rows = Array.isArray(payload?.datos) ? payload.datos : []
        return {
          datos: rows.map(normalizeNotificacion),
          total: Number(payload?.total ?? rows.length),
        }
      },
    ])
  },

  async marcarComoLeida(id: number): Promise<void> {
    await tryMany<void>([
      async () => {
        await http.put(`/notificaciones/${id}/leida`)
      },
      async () => {
        await http.patch(`/notificaciones/${id}/leida`)
      },
      async () => {
        await http.put(`/notificaciones/${id}`, { leido: true })
      },
    ])
  },

  async marcarTodasComoLeidas(): Promise<number> {
    return tryMany<number>([
      async () => {
        const { data } = await http.put('/notificaciones/marcar-todas-leidas')
        const payload = extractData<any>(data)
        return Number(payload?.cantidad ?? payload?.total ?? 0)
      },
      async () => {
        const { data } = await http.put('/notificaciones/marcar-todas')
        const payload = extractData<any>(data)
        return Number(payload?.cantidad ?? payload?.total ?? 0)
      },
      async () => {
        const { data } = await http.put('/notificaciones/leidas')
        const payload = extractData<any>(data)
        return Number(payload?.cantidad ?? payload?.total ?? 0)
      },
    ])
  },

  async obtenerEstadisticasNoLeidas(): Promise<EstadisticasNotificacionesNoLeidas> {
    return tryMany<EstadisticasNotificacionesNoLeidas>([
      async () => {
        const { data } = await http.get('/notificaciones/estadisticas-no-leidas')
        const payload = extractData<any>(data) || {}
        return {
          total: Number(payload.total ?? 0),
          por_tipo: payload.por_tipo || {},
        }
      },
      async () => {
        const { data } = await http.get('/notificaciones/estadisticas')
        const payload = extractData<any>(data) || {}
        return {
          total: Number(payload.total ?? 0),
          por_tipo: payload.por_tipo || {},
        }
      },
      async () => {
        const noLeidas = await notificacionesService.obtenerNoLeidas(20)
        return {
          total: noLeidas.length,
          por_tipo: {},
        }
      },
    ])
  },
}

export default notificacionesService
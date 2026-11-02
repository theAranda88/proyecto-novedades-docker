import http from '../utils/httpClient'
import type {
  SolicitudAdmin,
  SolicitudDetalle,
  DashboardStats,
  EstadoSolicitud,
} from '../types'

// ─── Parámetros y respuestas ──────────────────────────────────────────────────

export interface GetSolicitudesParams {
  page?:     number
  limit?:    number
  search?:   string
  programa?: string
  estado?:   EstadoSolicitud | ''
}

export interface GetSolicitudesResponse {
  data:  SolicitudAdmin[]
  total: number
  page:  number
  limit: number
}

export interface ResolverPayload {
  accion:        'aprobar' | 'rechazar'
  observaciones: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

const adminService = {
  /** GET /admin/stats */
  async getStats(): Promise<DashboardStats> {
    const { data } = await http.get<DashboardStats>('/admin/stats')
    return data
  },

  /** GET /admin/solicitudes?... — lista paginada con filtros */
  async getSolicitudes(params: GetSolicitudesParams = {}): Promise<GetSolicitudesResponse> {
    const q = new URLSearchParams()
    if (params.page)     q.set('page',     String(params.page))
    if (params.limit)    q.set('limit',    String(params.limit))
    if (params.search)   q.set('search',   params.search)
    if (params.programa) q.set('programa', params.programa)
    if (params.estado)   q.set('estado',   params.estado)
    const { data } = await http.get<GetSolicitudesResponse>(`/admin/solicitudes?${q}`)
    return data
  },

  /** GET /admin/solicitudes/:id — detalle completo */
  async getDetalle(id: string): Promise<SolicitudDetalle> {
    const { data } = await http.get<SolicitudDetalle>(`/admin/solicitudes/${id}`)
    return data
  },

  /** POST /admin/solicitudes/:id/resolver — aprobar o rechazar con observaciones */
  async resolver(id: string, payload: ResolverPayload): Promise<void> {
    await http.post(`/admin/solicitudes/${id}/resolver`, payload)
  },

  /** POST /admin/solicitudes/:id/aprobar — acción rápida sin observaciones */
  async aprobar(id: string): Promise<void> {
    await http.post(`/admin/solicitudes/${id}/aprobar`, {})
  },

  /** POST /admin/solicitudes/:id/rechazar — acción rápida sin observaciones */
  async rechazar(id: string): Promise<void> {
    await http.post(`/admin/solicitudes/${id}/rechazar`, {})
  },

  /** GET /admin/reporte → Blob */
  async exportarReporte(): Promise<Blob> {
    const res = await http.get('/admin/reporte', { responseType: 'blob' } as never)
    return res.data as unknown as Blob
  },
}

export default adminService

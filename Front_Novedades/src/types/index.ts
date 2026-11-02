// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE RESPUESTA BASE API
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  ok: boolean
  mensaje: string
  datos: T
  codigo_estado: number
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE AUTENTICACIÓN
// ═══════════════════════════════════════════════════════════════════════════

export type RolUsuario = 'Administrador' | 'Secretaria' | 'Estudiante' | 'Docente'
export type RolUsuarioBackend = 'estudiante' | 'secretaria' | 'admin'

export interface LoginPayload {
  correo: string
  password: string
}

export interface LoginResponse {
  token: string
    student: StudentInfo
    requiresPasswordChange: boolean
}

export interface ChangePasswordPayload {
  password_actual: string
  password_nueva: string
  // Si tu formulario lo usa en UI, déjalo como opcional solo frontend
  password_confirmacion?: string
}

export interface ChangePasswordResponse {
    token: string
    student: StudentInfo
    requiresPasswordChange?: boolean
}
// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE ESTUDIANTE
// ═══════════════════════════════════════════════════════════════════════════

export interface StudentInfo {
    id: string
    nombre: string
    nombre_completo?: string
    codigo: string
    cod_alumno?: string
    rol?: RolUsuario
    carrera?: string
    programa?: string
    email?: string
    email_institucional?: string
    semestre?: number
    jornada?: string
    creditos_inscritos?: number
    creditos_max_permitidos?: number
    estado_academico?: string
    matricula_activa?: boolean
    requiresPasswordChange?: boolean
    avatarUrl?: string
    promedio?: string | number
}

export interface User {
    code: string
    name: string
    program: string
    semester: string
    avatarInitials: string
    mustChangePassword?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE SOLICITUDES
// ═══════════════════════════════════════════════════════════════════════════

export type TipoTramite = 
  | 'Cambio de Curso'
  | 'Cambio de Jornada'
  | 'Curso Dirigido'
  | 'Adición de Curso'
  | 'Cancelación de Semestre'
  | 'Examen Supletorio'
  | 'Cambio de Programa'

export type EstadoSolicitud = 'En proceso' | 'Aprobada' | 'Rechazada' | 'Pendiente' | 'En Revisión'

// Alias para mantener compatibilidad
export type EstadoSolicitudAdmin = EstadoSolicitud

export interface Solicitud {
    id: string
    tipo: TipoTramite
    fechaEnvio: string
    estado: EstadoSolicitud
    razonRechazo?: string
    descripcion?: string
    facultad?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE USUARIO (ADMIN)
// ═══════════════════════════════════════════════════════════════════════════

export interface UsuarioAdmin {
    id: number
    nombre: string
    nombre_completo: string
    email: string
    email_institucional?: string
    rol: RolUsuario
    codigo_estudiantil?: string
    codigo_institucional?: string
    activo: boolean
    estado?: EstadoUsuario
    carrera?: string
    programa?: string
    semestre?: number
    promedio?: string
    avatarUrl?: string
    idInstitucional?: string
}

export interface CreateUsuarioPayload {
    nombre_completo: string
    codigo_estudiantil: string  // ⚠️ REQUERIDO por backend
    codigo_institucional?: string
    email_institucional: string  // ⚠️ REQUERIDO
    email?: string
    rol: RolUsuario | 'ADMIN' | 'SECRETARIA' | 'ESTUDIANTE' | 'DOCENTE'
    carrera?: string
    programa?: string
    semestre?: number
}

export interface UpdateUsuarioPayload {
    nombre_completo?: string
    email_institucional?: string
    carrera?: string
    programa?: string
    semestre?: number
}

export interface UsuariosStats {
    total_usuarios: number
    estudiantes: number
    secretarias: number
    administradores: number
    activos: number
    inactivos: number
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE ERROR
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiError {
    message: string
    statusCode?: number
    field?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS ADICIONALES (Compatibilidad)
// ═══════════════════════════════════════════════════════════════════════════

export type EstadoUsuario = 'Activo' | 'Inactivo' | 'Suspension'

export interface SolicitudAdmin {
    id: number | string
    id_estudiante: number | string
    codigo_solicitud: string
    tipo: TipoTramite
    estado: EstadoSolicitud
    fecha_creacion: string
    fecha_actualizacion: string
    estudiante_nombre: string
    estudiante_codigo: string
    descripcion?: string
    razonRechazo?: string
    observaciones?: string
    programa?: string
    fechaEnvio?: string
    estudiante?: {
        nombre: string
        codigo: string
        programa: string
        semestre: number
        promedio: string
        email: string
        avatarUrl?: string
    }
}

export interface SolicitudDetalle extends SolicitudAdmin {
    detalles?: Record<string, any>
    documentos?: AdjuntoDocumento[]
    radicadoFecha?: string
    estadoActual?: string
    estadoSolicitado?: string
    justificacion?: string
    notaReglamento?: string
    historial?: any[]
    guiaDecision?: string
    programa?: string
    fechaEnvio?: string
    estudiante?: {
        nombre: string
        codigo: string
        programa: string
        semestre: number
        promedio: string
        email: string
    }
}

export interface DashboardStats {
    total_usuarios: number
    totalUsuarios?: number
    estudiantes: number
    secretarias: number
    administradores: number
    activos: number
    usuariosActivos?: number
    inactivos: number
    solicitudes_pendientes?: number
    totalPendientes?: number
    solicitudes_aprobadas?: number
    nuevasUltimaHora?: number
    crecimientoSemestre?: number
    porcentajeActivos?: number
    aprobadasHoy?: number
    metaDiariaPercent?: number
}

export interface PerfilAcademico {
    cod_alumno?: string
    nombre_completo?: string
    email_institucional?: string
    carrera?: string
    programa: string
    nombre_programa?: string
    semestre: number
    promedio?: number
    jornada: string
    creditos_inscritos: number
    creditos_max_permitidos: number
    estado_academico: string
    matricula_activa: boolean
}

export interface AdjuntoDocumento {
    nombre: string
    url: string
    tipo: string
    fecha_subida: string
}

export interface Grupo {
    id: number
    codigo_grupo: string
    nombre_curso: string
    cod_curso: string
    jornada: string
    dia_semana: string
    hora_inicio: string
    hora_fin: string
    docente: string
    aula: string | null
    cupo_maximo: number
    cupos_ocupados: number
    cupos_disponibles: number
    periodo: string
}

export interface FiltrosGrupos {
    periodo?: string
    curso_id?: number
    jornada?: string
}

export interface MateriaMatriculada {
    id: number
    codigo_grupo: string
    nombre_curso: string
    cod_curso: string
    jornada: string
    dia_semana: string
    hora_inicio: string
    hora_fin: string
    docente: string
    aula: string | null
    cupo_maximo: number
    cupos_ocupados: number
    cupos_disponibles: number
    periodo: string
    creditos?: number
    nota_parcial?: number | null
}

export interface NavItem {
    id: string
    label: string
    icon?: string
    route?: string
    children?: NavItem[]
    active?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE RESPUESTA - CREACIÓN DE SOLICITUD
// ═══════════════════════════════════════════════════════════════════════════

export interface ValidacionItem {
    nombre: string
    resultado: boolean
    detalle: string
}

export interface ValidacionJson {
    timestamp: string
    tipo_solicitud: string
    aprobado: boolean
    validaciones: ValidacionItem[]
}

export interface SolicitudCreada {
    id: number
    codigo_solicitud: string
    estado: string
    tipo_solicitud: string
    validacion_json: ValidacionJson
    created_at: string
}

export interface CrearSolicitudResponse {
    ok: boolean
    mensaje: string
    datos: SolicitudCreada
    codigo_estado: number
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE NOTIFICACIONES
// ═══════════════════════════════════════════════════════════════════════════

export type TipoNotificacion =
    | 'solicitud_nueva'
    | 'solicitud_aprobada'
    | 'solicitud_rechazada'
    | 'solicitud_revision'
    | 'cambio_estado'
    | 'general'

export type CanalEnvio = 'websocket' | 'fcm' | 'bd_pendiente' | 'fallback'

export interface Notificacion {
    id: number
    usuario_id: number
    solicitud_id?: number | null
    titulo: string
    mensaje: string
    tipo_notificacion: TipoNotificacion | string
    canal_envio?: CanalEnvio | string
    leido: boolean
    created_at: string
    updated_at?: string
}

export interface NotificacionesPaginadas {
    datos: Notificacion[]
    total: number
}

export interface EstadisticasNotificacionesNoLeidas {
    total: number
    por_tipo: Record<string, number>
}
import http from '../utils/httpClient'
import type { PerfilAcademico, AdjuntoDocumento, StudentInfo, MateriaMatriculada } from '../types'

function normalizarListaMaterias(items: any[]): MateriaMatriculada[] {
  return items
    .map((item): MateriaMatriculada => ({
      id: Number(item?.id ?? item?.grupo_id ?? item?.id_grupo ?? 0),
      codigo_grupo: String(item?.codigo_grupo ?? item?.grupo_codigo ?? item?.cod_grupo ?? item?.grupo ?? 'N/A'),
      nombre_curso: String(item?.nombre_curso ?? item?.nombre_materia ?? item?.materia ?? item?.curso ?? 'Materia'),
      cod_curso: String(item?.cod_curso ?? item?.codigo_curso ?? item?.curso_codigo ?? 'N/A'),
      jornada: String(item?.jornada ?? 'manana'),
      dia_semana: String(item?.dia_semana ?? item?.dia ?? 'N/D'),
      hora_inicio: String(item?.hora_inicio ?? item?.horaInicial ?? '00:00:00'),
      hora_fin: String(item?.hora_fin ?? item?.horaFinal ?? '00:00:00'),
      docente: String(item?.docente ?? item?.nombre_docente ?? 'Por asignar'),
      aula: item?.aula ?? null,
      cupo_maximo: Number(item?.cupo_maximo ?? item?.cupo ?? 0),
      cupos_ocupados: Number(item?.cupos_ocupados ?? item?.inscritos ?? 0),
      cupos_disponibles: Number(item?.cupos_disponibles ?? item?.disponibles ?? 0),
      periodo: String(item?.periodo ?? item?.periodo_academico ?? ''),
      creditos: item?.creditos != null ? Number(item.creditos) : undefined,
      nota_parcial: item?.nota_parcial ?? null,
    }))
    .filter((m) => !!m.nombre_curso && m.id >= 0)
}

function extraerArregloRespuesta(data: any): any[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.datos)) return data.datos
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.materias)) return data.materias
  if (Array.isArray(data?.grupos)) return data.grupos
  if (Array.isArray(data?.datos?.materias)) return data.datos.materias
  if (Array.isArray(data?.datos?.grupos)) return data.datos.grupos
  return []
}

function obtenerCodigoDesdeStorage(): string | null {
  try {
    const raw = localStorage.getItem('auth_student')
    if (!raw) return null
    const student = JSON.parse(raw)
    return student?.codigo || student?.cod_alumno || null
  } catch {
    return null
  }
}

/**
 * Convierte un archivo File a Base64 con prefijo data:tipo;base64,
 * El backend valida el tipo MIME desde el prefijo
 */
function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Retornar el contenido completo con prefijo (data:tipo;base64,...)
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(archivo)
  })
}

const estudiantesService = {
  /**
   * Obtiene la información completa del estudiante autenticado
   */
  async getInfoCompleta(): Promise<StudentInfo> {
    const { data } = await http.get<StudentInfo>('/estudiantes/info')
    return data
  },

  /**
   * Obtiene el perfil académico del estudiante autenticado
   * Mapea la respuesta del backend con estructura { ok, mensaje, datos }
   */
  async getPerfilAcademico(): Promise<PerfilAcademico> {
    const response = await http.get<{
      ok: boolean
      mensaje: string
      datos: {
        cod_alumno: string
        nombre_completo: string
        email_institucional: string
        semestre: number
        nombre_programa: string
        jornada: string
        creditos_inscritos: number
        creditos_max_permitidos: number
        estado_academico: string
        matricula_activa: boolean
      }
    }>('/estudiantes/perfil')
    
    // Mapear la estructura del backend a PerfilAcademico
    const datos = response.data.datos
    return {
      cod_alumno: datos.cod_alumno,
      nombre_completo: datos.nombre_completo,
      email_institucional: datos.email_institucional,
      semestre: datos.semestre,
      programa: datos.nombre_programa,
      nombre_programa: datos.nombre_programa,
      jornada: datos.jornada,
      creditos_inscritos: datos.creditos_inscritos,
      creditos_max_permitidos: datos.creditos_max_permitidos,
      estado_academico: datos.estado_academico,
      matricula_activa: datos.matricula_activa
    }
  },

  /**
   * Adjunta un documento a una solicitud específica
   * Convierte el archivo a Base64 y lo envía al backend
   * Soporta: PDF, JPG, PNG (máximo 5MB)
   * 
   * El backend valida el tipo MIME por el prefijo Base64
   * 
   * @param solicitudId - ID de la solicitud
   * @param archivo - Archivo File del input
   * @returns { id, url, nombre } del adjunto creado
   */
  async adjuntarDocumento(
    solicitudId: string,
    archivo: File,
  ): Promise<AdjuntoDocumento> {
    try {
      // 1. Convertir archivo a Base64 con prefijo data:tipo;base64,
      const base64 = await archivoABase64(archivo)
      
      // 2. Enviar JSON con nombre_archivo y archivo_base64
      const { data } = await http.post<any>(
        `/estudiantes/solicitudes/${solicitudId}/adjunto`,
        {
          nombre_archivo: archivo.name,
          archivo_base64: base64
        }
      )
      
      console.log('✅ Adjunto guardado:', data.datos)
      return data.datos
    } catch (error) {
      console.error('❌ Error adjuntando documento:', error)
      throw error
    }
  },

  /**
   * Lista los documentos adjuntos de una solicitud específica
   * 
   * Response: Array de adjuntos { id, nombre_archivo, tipo_mime, tamanio_bytes, url_storage, created_at }
   * Backend envuelve en: { ok, mensaje, datos: [...], codigo_estado }
   */
  async listarAdjuntosPorSolicitud(solicitudId: string | number): Promise<AdjuntoDocumento[]> {
    try {
      const { data } = await http.get<any>(
        `/estudiantes/solicitudes/${solicitudId}/adjuntos`
      )
      // El backend devuelve: { ok, mensaje, datos: [...], codigo_estado }
      return data.datos || []
    } catch (error) {
      console.error('❌ Error listando adjuntos de solicitud:', error)
      return []
    }
  },

  /**
   * Obtiene las materias matriculadas del estudiante autenticado
   * Response: { ok, mensaje, datos: [...], codigo_estado }
   */
  async getMateriasMatriculadas(): Promise<MateriaMatriculada[]> {
    const codigoEstudiante = obtenerCodigoDesdeStorage()

    const intentos: Array<{ url: string; params?: Record<string, string> }> = [
      { url: '/estudiantes/materias' },
      { url: '/estudiantes/materias-matriculadas' },
      { url: '/estudiantes/carga-academica' },
      { url: '/estudiantes/grupos' },
      ...(codigoEstudiante ? [{ url: '/estudiantes/materias', params: { codigo_estudiantil: codigoEstudiante } }] : []),
      ...(codigoEstudiante ? [{ url: `/estudiantes/${codigoEstudiante}/materias` }] : []),
    ]

    for (const intento of intentos) {
      try {
        const { data } = await http.get<any>(intento.url, intento.params ? { params: intento.params } : undefined)
        const lista = extraerArregloRespuesta(data)
        if (lista.length > 0) {
          return normalizarListaMaterias(lista)
        }
      } catch {
        // Continuar con el siguiente intento
      }
    }

    // Fallback: algunos backends incluyen materias en /estudiantes/perfil
    try {
      const { data } = await http.get<any>('/estudiantes/perfil')
      const listaPerfil = extraerArregloRespuesta(data)
      if (listaPerfil.length > 0) {
        return normalizarListaMaterias(listaPerfil)
      }
    } catch {
      // Silenciar fallback
    }

    console.warn('⚠️ No se encontraron materias matriculadas: endpoint no disponible o respuesta vacía')
    return []
  },

  /**
   * Obtiene los IDs de grupos en los que está matriculado el estudiante
   * Útil para verificar en el formulario si ya está inscrito en un grupo
   */
  async getGruposMatriculadosIds(): Promise<number[]> {
    const materias = await this.getMateriasMatriculadas()
    return [...new Set(materias.map(m => m.id).filter((id) => Number.isFinite(id) && id > 0))]
  },
}

export default estudiantesService

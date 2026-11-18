import http from '../utils/httpClient'
import type { Grupo, FiltrosGrupos } from '../types'

const gruposService = {
  /**
   * Lista todos los grupos disponibles
   * Soporta filtros por período, curso y jornada
   * 
   * Response: Array de grupos
   * Backend envuelve en: { ok, mensaje, datos: [...], codigo_estado }
   */
  async listarGrupos(filtros?: FiltrosGrupos): Promise<Grupo[]> {
    try {
      const params = new URLSearchParams()
      if (filtros) {
        if (filtros.periodo) params.append('periodo', filtros.periodo)
        if (filtros.curso_id) params.append('curso_id', String(filtros.curso_id))
        if (filtros.jornada) params.append('jornada', filtros.jornada)
      }

      const { data } = await http.get<any>(
        `/grupos${params.toString() ? `?${params.toString()}` : ''}`,
      )
      // El backend devuelve: { ok, mensaje, datos: [...], codigo_estado }
      return data.datos || []
    } catch (error) {
      console.error('❌ Error listando grupos:', error)
      return []
    }
  },

  /**
   * Lista todos los grupos de un período específico
   */
  async listarPorPeriodo(periodo: string): Promise<Grupo[]> {
    return this.listarGrupos({ periodo })
  },

  /**
   * Lista grupos filtrados por curso
   */
  async listarPorCurso(periodo: string, cursoId: number): Promise<Grupo[]> {
    return this.listarGrupos({ periodo, curso_id: cursoId })
  },

  /**
   * Lista grupos filtrados por jornada
   * 
   * Se usa para "Cambio de Jornada" - mostrar cursos disponibles en la nueva jornada
   */
  async listarPorJornada(
    periodo: string,
    jornada: 'manana' | 'tarde' | 'noche',
  ): Promise<Grupo[]> {
    return this.listarGrupos({ periodo, jornada })
  },

  /**
   * Obtiene cursos disponibles filtrados por jornada
   * Usado para mostrar cursos en formularios según la jornada seleccionada
   * 
   * Mapea valores como "Mañana" → "manana", etc.
   */
  /**
   * Obtiene cursos del período más reciente con grupos activos.
   * El backend resuelve el período para no depender de la fecha del navegador.
   */
  async obtenerTodosLosCursos(): Promise<Grupo[]> {
    try {
      return this.listarGrupos()
    } catch (error) {
      console.error('❌ Error al obtener todos los cursos:', error)
      return []
    }
  },

  async obtenerCursosPorJornada(jornada: string): Promise<Grupo[]> {
    try {
      // Mapear valores de jornada al formato esperado por la API
      const jornadaMap: Record<string, string> = {
        'Mañana': 'manana',
        'Tarde': 'tarde',
        'Noche': 'noche',
        'mañana': 'manana',
        'tarde': 'tarde',
        'noche': 'noche',
      }
      
      const jornadaFormato = jornadaMap[jornada] || jornada
      
      return this.listarGrupos({ jornada: jornadaFormato })
    } catch (error) {
      console.error('❌ Error al obtener cursos por jornada:', error)
      return []
    }
  },
}

export default gruposService

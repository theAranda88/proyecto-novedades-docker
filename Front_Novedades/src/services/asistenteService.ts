import type { RouteLocationRaw } from 'vue-router'
import solicitudesService from './solicitudesService'
import { etiquetaSolicitud } from '../utils/solicitudDisplay'

export interface RespuestaAsistente {
  texto: string
  enlace?: { texto: string; destino: RouteLocationRaw }
}

const historial = { texto: 'Ir a mi historial', destino: { name: 'History' } }
const formulario = { texto: 'Abrir nueva solicitud', destino: { name: 'NewApplication' } }

export const preguntasFrecuentes = [
  '¿Cómo creo una solicitud?',
  'Estado de mi solicitud',
  '¿Qué documentos puedo adjuntar?',
  '¿Cuánto tarda la respuesta?',
]

export async function responderConsulta(pregunta: string): Promise<RespuestaAsistente> {
  const texto = pregunta.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
  const codigo = texto.match(/\breq-\d{4}-\d+\b/)?.[0]

  if (codigo) return consultarEstado(codigo)
  if (/\b(document\w*|adjunt\w*|soportes?|archivos?|pdf|requisitos?)\b/.test(texto)) {
    return {
      texto: 'Si necesitas respaldar tu justificación, puedes adjuntar certificados u otros soportes en PDF, JPG o PNG. Cada archivo puede pesar hasta 5 MB.',
      enlace: formulario,
    }
  }
  if (/\b(tard\w*|plazos?|demor\w*|tiempos?|cuanto tarda|cuando (responden|recibo))\b/.test(texto)) {
    return {
      texto: 'El formulario indica un tiempo estimado de 3 a 5 días hábiles. Puedes seguir el trámite desde Mi historial.',
      enlace: historial,
    }
  }
  if (/\b(estado|seguimiento|aprob\w*|rechaz\w*|pendiente|revision|va mi solicitud)\b/.test(texto)) {
    return consultarEstado()
  }
  if (/\b(historial|mis solicitudes)\b/.test(texto)) {
    return { texto: 'En Mi historial puedes buscar tus solicitudes por código o tipo de trámite y filtrar por estado.', enlace: historial }
  }
  if (/\b(cre\w*|radic\w*|envi\w*|present\w*|nueva|tramite|cambio|adicion|dirigido)\b/.test(texto)) {
    return {
      texto: 'En Nueva solicitud, elige el tipo de trámite, completa los datos y la justificación, adjunta soportes si corresponden y envía el formulario.',
      enlace: formulario,
    }
  }
  return {
    texto: 'Puedo orientarte sobre cómo crear una solicitud, qué archivos adjuntar y cuánto tarda la respuesta. También puedes escribirme el código de tu solicitud para consultar su estado.',
  }
}

async function consultarEstado(codigo?: string): Promise<RespuestaAsistente> {
  try {
    const solicitudes = await solicitudesService.getMisSolicitudes(undefined, { propagarError: true })
    const solicitud = codigo
      ? solicitudes.find(item => item.codigo_solicitud?.toLowerCase() === codigo)
      : solicitudes[0]

    if (!solicitud) {
      return {
        texto: codigo
          ? `No encontré ${codigo.toUpperCase()} en tus solicitudes. Revisa el código en Mi historial.`
          : 'Todavía no tienes solicitudes registradas.',
        enlace: codigo ? historial : formulario,
      }
    }

    const referencia = solicitud.codigo_solicitud || solicitud.id
    const tipo = etiquetaSolicitud(solicitud.tipo_solicitud || solicitud.tipo)
    const estado = etiquetaSolicitud(solicitud.estado)
    const encabezado = codigo ? 'Solicitud' : 'Tu solicitud más reciente es'
    return { texto: `${encabezado} ${referencia} · ${tipo}. Estado: ${estado}.`, enlace: historial }
  } catch {
    return { texto: 'No pude consultar tus solicitudes ahora. Intenta de nuevo en unos minutos.', enlace: historial }
  }
}

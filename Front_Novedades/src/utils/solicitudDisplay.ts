const nombres: Record<string, string> = {
  adicion_curso: 'Adición de Curso',
  cambio_curso: 'Cambio de Curso',
  cambio_jornada: 'Cambio de Jornada',
  curso_dirigido: 'Curso Dirigido',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  en_revision: 'En revisión',
}

export function etiquetaSolicitud(valor?: string): string {
  if (!valor?.trim()) return 'Sin información'
  const clave = valor.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, '_')
  return nombres[clave] || valor.replaceAll('_', ' ')
}

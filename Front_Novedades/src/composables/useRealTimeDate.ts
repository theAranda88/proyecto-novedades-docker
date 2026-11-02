import { ref, onMounted, onUnmounted } from 'vue'

export function useRealTimeDate() {
  const currentDate = ref<string>('')
  const currentTime = ref<string>('')
  let intervalId: ReturnType<typeof setInterval> | null = null

  function formatearFecha(fecha: Date): string {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
    return fecha.toLocaleDateString('es-CO', opciones)
  }

  function formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  function actualizarFechaHora() {
    const ahora = new Date()
    currentDate.value = formatearFecha(ahora)
    currentTime.value = formatearHora(ahora)
  }

  onMounted(() => {
    // Actualizar inmediatamente
    actualizarFechaHora()
    
    // Actualizar cada segundo
    intervalId = setInterval(() => {
      actualizarFechaHora()
    }, 1000)
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    currentDate,
    currentTime
  }
}

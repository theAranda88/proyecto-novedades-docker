<template>
  <div class="space-y-2">
    <!-- Breadcrumb con fecha/hora en tiempo real -->
    <div class="flex items-center justify-between">
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <span>Trámites Académicos</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
        </svg>
        <span class="text-slate-600 font-medium">Nueva Solicitud</span>
      </nav>
      <div class="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="font-medium text-slate-600">{{ horaActual }}</span>
        <span class="text-slate-400">•</span>
        <span class="text-slate-600">{{ fechaActual }}</span>
      </div>
    </div>

    <!-- Título -->
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Formulario de Solicitud</h1>
      <p class="text-sm text-slate-500 mt-1">
        Complete los siguientes campos para formalizar su requerimiento ante la secretaría académica.
        Asegúrese de adjuntar los soportes necesarios.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const horaActual = ref<string>('')
const fechaActual = ref<string>('')
let intervalo: NodeJS.Timeout | null = null

function actualizarFechaHora() {
  const ahora = new Date()
  
  // Formato hora: HH:MM:SS
  horaActual.value = ahora.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  // Formato fecha: Día, DD de Mes
  fechaActual.value = ahora.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/,/g, '')
}

onMounted(() => {
  actualizarFechaHora()
  // Actualizar cada segundo
  intervalo = setInterval(actualizarFechaHora, 1000)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>
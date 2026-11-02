<template>
  <!-- Grid de cards -->
  <div v-if="solicitudes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <HistoryCard
      v-for="solicitud in solicitudes"
      :key="solicitud.id"
      :solicitud="solicitud"
      @ver-detalle="$emit('ver-detalle', $event)"
    />
  </div>

  <!-- Estado vacío -->
  <div v-else class="py-16 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
    <p class="text-sm text-slate-400">No se encontraron solicitudes.</p>
  </div>
</template>

<script setup lang="ts">
import HistoryCard from '../historial/HistoryCard.vue'
import type { EstadoSolicitud } from '../../types'

interface SolicitudHistorial {
  id: string
  tipo: string
  descripcion: string
  fechaEnvio: string
  facultad: string
  estado: EstadoSolicitud
  justificacionRechazo?: string
}

defineProps<{ solicitudes: SolicitudHistorial[] }>()
defineEmits<{ (e: 'ver-detalle', id: string): void }>()
</script>
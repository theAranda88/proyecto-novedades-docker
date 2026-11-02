<template>
  <div class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3
              hover:shadow-md hover:border-slate-300 transition-all">

    <!-- Código + Estado -->
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {{ solicitud.id }}
      </span>
      <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold', estadoBadge[solicitud.estado]]">
        <svg v-if="solicitud.estado === 'Aprobada'" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <svg v-else-if="solicitud.estado === 'Rechazada'" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
        </svg>
        {{ solicitud.estado }}
      </span>
    </div>

    <!-- Título + descripción -->
    <div>
      <h3 class="text-sm font-bold text-slate-800">{{ solicitud.tipo }}</h3>
      <p class="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{{ solicitud.descripcion }}</p>
    </div>

    <!-- Justificación de rechazo (secretaría) -->
    <div
      v-if="solicitud.estado === 'Rechazada' && solicitud.justificacionRechazo"
      class="rounded-lg border border-red-200 bg-red-50 px-3 py-2"
    >
      <p class="text-[11px] font-semibold uppercase tracking-wide text-red-700">Motivo de rechazo</p>
      <p class="mt-1 text-xs leading-relaxed text-red-800">{{ solicitud.justificacionRechazo }}</p>
    </div>

    <!-- Fecha + Facultad -->
    <div class="flex items-center justify-between text-[11px] border-t border-slate-200 pt-3">
      <div class="flex flex-col gap-0.5">
        <div class="flex items-center gap-1 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Fecha</span>
        </div>
        <span class="text-slate-600 font-medium">{{ formatDate(solicitud.fechaEnvio) }}</span>
      </div>
      <div class="flex flex-col gap-0.5 text-right">
        <div class="flex items-center justify-end gap-1 text-slate-400">
          <span>Facultad</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <span class="text-slate-600 font-medium">{{ solicitud.facultad }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatDate } from '../../utils/validators'
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

defineProps<{ solicitud: SolicitudHistorial }>()
defineEmits<{ (e: 'ver-detalle', id: string): void }>()

const estadoBadge: Record<EstadoSolicitud, string> = {
  'Aprobada':   'bg-green-100 text-green-700',
  'Rechazada':  'bg-red-100 text-red-700',
  'En proceso': 'bg-blue-100 text-blue-700',
  'En Revisión':'bg-indigo-100 text-indigo-700',
  'Pendiente':  'bg-yellow-100 text-yellow-700',
}
</script>
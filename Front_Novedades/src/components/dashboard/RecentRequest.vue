<template>
  <div>
    <!-- Header -->
    <section class="bg-white rounded-t-md border border-b-0 border-slate-200 px-6 py-5">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-600 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
            </svg>
            <h3 class="text-base font-semibold text-slate-800 leading-none">Solicitudes Recientes</h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">Estado actual de tus trámites académicos más recientes</p>
        </div>
        <button
          class="text-sm inline-flex items-center gap-1 text-blue-600 font-medium px-4 py-3
                 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          @click="$emit('ver-historial')"
        >
          Ver historial completo
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Tabla -->
    <div class="max-w-full overflow-x-auto bg-white border border-slate-200 rounded-b-md">
      <table class="min-w-full">
        <thead>
          <tr class="border-y border-gray-100">
            <th class="px-6 py-3 text-left"><p class="text-xs font-medium text-slate-500">ID Solicitud</p></th>
            <th class="px-6 py-3 text-left"><p class="text-xs font-medium text-slate-500">Tipo de Trámite</p></th>
            <th class="px-6 py-3 text-left"><p class="text-xs font-medium text-slate-500">Fecha Envío</p></th>
            <th class="px-6 py-3 text-left"><p class="text-xs font-medium text-slate-500">Estado</p></th>
            <th class="px-6 py-3 text-right"><p class="text-xs font-medium text-slate-500">Acción</p></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="solicitud in solicitudes" :key="solicitud.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-3.5">
              <p class="text-xs font-medium text-blue-600">{{ solicitud.id }}</p>
            </td>
            <td class="px-6 py-3.5">
              <p class="text-xs font-medium text-slate-800">{{ solicitud.tipo }}</p>
            </td>
            <td class="px-6 py-3.5">
              <p class="text-xs text-slate-400">{{ solicitud.fechaEnvio }}</p>
            </td>
            <td class="px-6 py-3.5">
              <span :class="['inline-block px-2 py-0.5 text-xs font-medium rounded-full', estadoBadge[solicitud.estado]]">
                {{ solicitud.estado }}
              </span>
            </td>
            <td class="px-6 py-3.5 text-right">
              <span class="text-xs font-medium text-slate-500"> </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EstadoSolicitud } from '../../types'

// Tipo local para esta tabla — luego se reemplaza con el tipo real del backend
interface SolicitudTabla {
  id: string
  tipo: string
  fechaEnvio: string
  estado: EstadoSolicitud
}

defineProps<{ solicitudes: SolicitudTabla[] }>()

defineEmits<{
  (e: 'ver-historial'): void
  (e: 'ver-detalle', id: string): void
}>()

const estadoBadge: Record<EstadoSolicitud, string> = {
  'Aprobada':   'bg-green-100 text-green-700',
  'Rechazada':  'bg-red-100 text-red-700',
  'En proceso': 'bg-blue-100 text-blue-700',
  'Pendiente':  'bg-yellow-100 text-yellow-700',
}
</script>
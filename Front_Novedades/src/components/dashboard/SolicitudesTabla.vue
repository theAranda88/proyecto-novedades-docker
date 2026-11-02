<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="flex items-center gap-2 text-[14px] font-bold text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Solicitudes Recientes
        </h2>
        <p class="text-[11px] text-slate-400 mt-0.5 ml-5">Estado actual de tus trámites académicos más recientes</p>
      </div>
      <RouterLink
        :to="{ name: 'MiHistorial' }"
        class="flex items-center gap-1.5 text-[12px] text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
      >
        Ver historial completo
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </RouterLink>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/60">
            <th class="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ID Solicitud</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tipo de Trámite</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fecha Envío</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
            <th class="text-right px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(req, i) in solicitudes"
            :key="req.id"
            :class="['border-b border-slate-50 hover:bg-slate-50/70 transition-colors', i === solicitudes.length - 1 && 'border-b-0']"
          >
            <td class="px-6 py-4">
              <span class="text-indigo-600 font-semibold text-[13px] cursor-pointer hover:text-indigo-700">{{ req.id }}</span>
            </td>
            <td class="px-4 py-4 text-[13px] text-slate-600">{{ req.tipo }}</td>
            <td class="px-4 py-4 text-[13px] text-slate-500">{{ req.fechaEnvio }}</td>
            <td class="px-4 py-4">
              <span :class="statusClass(req.estado)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                {{ req.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-[12px] text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                Ver Detalle
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Solicitud, EstadoSolicitud } from '../../types'

defineProps<{ solicitudes: Solicitud[] }>()

const statusClass = (status: EstadoSolicitud): string => {
  const map: Record<EstadoSolicitud, string> = {
    'En proceso':  'bg-blue-50 text-blue-600',
    'Aprobada':    'bg-emerald-50 text-emerald-600',
    'Rechazada':   'bg-red-100 text-red-600',
    'Pendiente':   'bg-yellow-50 text-yellow-600',
    'En Revisión': 'bg-amber-50 text-amber-600',
  }
  return map[status] ?? 'bg-slate-100 text-slate-500'
}
</script>
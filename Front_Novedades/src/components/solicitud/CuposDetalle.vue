<template>
  <div v-if="grupo" class="mt-2 flex flex-wrap gap-2 items-center">
    <!-- Cupos disponibles -->
    <span
      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      :class="badgeClasesCupos"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      {{ grupo.cupos_disponibles }} / {{ grupo.cupo_maximo }} cupos
    </span>

    <!-- Barra de ocupación -->
    <div class="flex items-center gap-1.5 flex-1 min-w-[80px]">
      <div class="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          class="h-1.5 rounded-full transition-all duration-500"
          :class="barraColor"
          :style="{ width: `${Math.min(porcentajeOcupacion, 100)}%` }"
        ></div>
      </div>
      <span class="text-[10px] text-slate-400 shrink-0">{{ porcentajeOcupacion }}%</span>
    </div>

    <!-- Badge: ya matriculado -->
    <span
      v-if="estaMatriculado"
      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Ya inscrito
    </span>

    <!-- Badge: sin cupos -->
    <span
      v-if="grupo.cupos_disponibles === 0"
      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      Sin cupos
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Grupo } from '../../types'

interface Props {
  grupo?: Grupo
  matriculadosIds?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  matriculadosIds: () => []
})

const estaMatriculado = computed(() =>
  props.grupo ? props.matriculadosIds.includes(props.grupo.id) : false
)

const porcentajeOcupacion = computed(() => {
  if (!props.grupo || props.grupo.cupo_maximo === 0) return 0
  return Math.round((props.grupo.cupos_ocupados / props.grupo.cupo_maximo) * 100)
})

const badgeClasesCupos = computed(() => {
  if (!props.grupo) return 'bg-slate-100 text-slate-500'
  if (props.grupo.cupos_disponibles === 0) return 'bg-red-50 text-red-600 border border-red-200'
  if (props.grupo.cupos_disponibles <= 5) return 'bg-amber-50 text-amber-600 border border-amber-200'
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
})

const barraColor = computed(() => {
  if (porcentajeOcupacion.value >= 100) return 'bg-red-400'
  if (porcentajeOcupacion.value >= 80) return 'bg-amber-400'
  return 'bg-blue-500'
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">

    <!-- Buscador -->
    <div class="relative flex-1 w-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        :value="busqueda"
        @input="$emit('update:busqueda', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Buscar por tipo de solicitud o código (ej: CJ-2023)..."
        class="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white
               focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
      />
    </div>

    <!-- Filtros -->
    <div class="flex items-center gap-1.5 shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
      </svg>
      <span class="text-xs text-slate-500 mr-1">Filtrar por:</span>
      <div class="flex items-center gap-0.5 rounded-sm bg-slate-200 p-1">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          @click="$emit('update:filtroActivo', filtro.value)"
          :class="[
            'px-3 py-1.5 rounded-sm text-xs font-medium transition-colors',
            filtroActivo === filtro.value
              ? 'bg-white text-blue-600'
              : 'bg-transparent text-slate-600 hover:bg-slate-50'
          ]"
        >
          {{ filtro.label }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  busqueda: string
  filtroActivo: string
}>()

defineEmits<{
  (e: 'update:busqueda', value: string): void
  (e: 'update:filtroActivo', value: string): void
}>()

const filtros = [
  { label: 'Todos',      value: 'Todos' },
  { label: 'Pendientes', value: 'Pendiente' },
  { label: 'Aprobadas',  value: 'Aprobada' },
  { label: 'Rechazadas', value: 'Rechazada' },
]
</script>
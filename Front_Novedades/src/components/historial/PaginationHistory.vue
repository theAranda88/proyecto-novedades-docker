<template>
  <div class="border-t border-slate-200 pt-4 mt-4 flex items-center justify-between">
    <p class="text-xs text-slate-400">
      Mostrando {{ mostrando }} de {{ total }} resultados
    </p>
    <div class="flex items-center gap-1">
      <button
        class="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500
               hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="paginaActual === 1"
        @click="$emit('update:paginaActual', paginaActual - 1)"
      >
        ← Anterior
      </button>

      <button
        v-for="pagina in totalPaginas"
        :key="pagina"
        @click="$emit('update:paginaActual', pagina)"
        :class="[
          'w-8 h-8 text-xs rounded-lg border transition-colors',
          paginaActual === pagina
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        ]"
      >
        {{ pagina }}
      </button>

      <button
        class="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500
               hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="paginaActual === totalPaginas"
        @click="$emit('update:paginaActual', paginaActual + 1)"
      >
        Siguiente →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  paginaActual: number
  totalPaginas: number
  mostrando: number
  total: number
}>()

defineEmits<{ (e: 'update:paginaActual', value: number): void }>()
</script>
<template>
  <div class="flex items-center justify-between mb-6">
    <!-- Saludo -->
    <div>
      <h1 class="text-lg font-bold text-slate-800">
        ¡Hola de nuevo, {{ student?.nombre || 'Estudiante' }}! 👋
      </h1>
      <div class="flex items-center mt-1">
        <span class="text-xs text-slate-500 pr-1">{{ student?.carrera || student?.programa || '—' }}</span>
        <span class="text-xs text-slate-500 px-1 border-l border-slate-300">{{ student?.semestre }}º Semestre</span>
        <span class="text-xs text-slate-500 px-1 border-l border-slate-300">Código: {{ student?.codigo || '—' }}</span>
      </div>
    </div>

    <!-- Derecha: fecha + botón -->
    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-semibold text-slate-700">Próxima fecha de registro</p>
        <p class="text-xs text-slate-400">{{ fechaProxima }}</p>
      </div>
      <button
        class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700
               active:bg-blue-800 text-white text-sm font-medium px-4 py-2.5
               rounded-lg transition-colors"
        @click="$emit('nueva-solicitud')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        Nueva Solicitud
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../store/authStore'

const authStore = useAuthStore()
const { student } = storeToRefs(authStore)

defineEmits<{ (e: 'nueva-solicitud'): void }>()

// Calcular próxima fecha de registro (simulado - en el backend sería del API)
const fechaProxima = computed(() => {
  const hoy = new Date()
  const proximaFecha = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 días después
  return proximaFecha.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })
})
</script>
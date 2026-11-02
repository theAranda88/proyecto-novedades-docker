<template>
  <div class="flex flex-col bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
    <div class="flex items-center gap-4">
      <div class="bg-blue-100 p-2 rounded-full flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div>
        <span class="text-xs font-semibold text-blue-700">Ayuda rápida</span>
        <p class="text-xs text-slate-400 mt-0.5">
          Usted está realizando una solicitud de
          <span class="font-semibold text-blue-600">{{ tipoSolicitud || '...' }}</span>.
          El tiempo estimado de respuesta es de 3 a 5 días hábiles.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tipoSolicitud: string }>()
</script>
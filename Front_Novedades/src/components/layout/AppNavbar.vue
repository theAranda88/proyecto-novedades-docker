<template>
  <nav class="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
        {{ initials }}
      </div>
      <span class="text-slate-700 font-medium">Bienvenido</span>
    </div>
    <div class="flex items-center gap-4">
      <button class="text-slate-600 hover:text-slate-800 transition-colors">
        Notificaciones
      </button>
      <button class="text-slate-600 hover:text-slate-800 transition-colors">
        Perfil
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  initials: string
}>()
</script>

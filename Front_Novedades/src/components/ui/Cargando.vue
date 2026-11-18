<script setup lang="ts">
withDefaults(defineProps<{
  texto?: string
  inline?: boolean
  decorativo?: boolean
}>(), { texto: 'Cargando…' })
</script>

<template>
  <span
    :role="decorativo ? undefined : 'status'"
    :aria-hidden="decorativo || undefined"
    :class="inline || decorativo
      ? 'inline-flex items-center gap-2 text-sm'
      : 'flex min-h-32 flex-col items-center justify-center gap-3 px-4 py-8 text-center text-sm text-slate-600'"
  >
    <span aria-hidden="true" class="indicador shrink-0" :class="inline || decorativo ? 'size-4' : 'size-7'"></span>
    <span v-if="!decorativo">{{ texto }}</span>
  </span>
</template>

<style scoped>
.indicador {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: girar .8s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .indicador { animation: none; }
}
</style>

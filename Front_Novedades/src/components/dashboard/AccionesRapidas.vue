<template>
  <section>
    <h2 class="flex items-center gap-2 text-[14px] font-bold text-slate-700 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Acciones Rápidas
    </h2>
    <div class="grid grid-cols-4 gap-4">
      <button
        v-for="(action, i) in actions"
        :key="action.type"
        @click="$emit('select', action.type)"
        :class="[
          'rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1 group',
          selected === i
            ? 'border-indigo-400 bg-indigo-50/60 shadow-md shadow-indigo-100'
            : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm',
        ]"
      >
        <div class="text-2xl mb-3 transition-transform duration-200 group-hover:scale-110 origin-left">
          {{ action.emoji }}
        </div>
        <h3 class="text-[13px] font-bold text-slate-800 mb-1.5">{{ action.type }}</h3>
        <p class="text-[11px] text-slate-400 leading-relaxed">{{ action.description }}</p>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { QuickAction, TipoTramite } from '../../types'

defineProps<{
  actions: QuickAction[]
  selected: number
}>()

defineEmits<{ select: [type: TipoTramite] }>()
</script>
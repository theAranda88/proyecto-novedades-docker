<template>
  <div class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 xl:grid-cols-4">
    <button
      v-for="action in actions"
      :key="action.type"
      type="button"
      class="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:p-5"
      @click="$emit('seleccionar', action.type)"
    >
      <div
        class="mb-3 flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100"
        aria-hidden="true"
        v-html="action.icon"
      />
      <h3 class="text-sm font-semibold text-slate-800 tracking-tight mb-1">
        {{ action.type }}
      </h3>
      <p class="text-sm text-slate-500 leading-relaxed">
        {{ action.description }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TipoTramite } from '../../types'

defineEmits<{ seleccionar: [tipo: TipoTramite] }>()

const actions = [
  {
    type: 'Cambio de Curso' as TipoTramite,
    description: 'Solicita moverte a una sección diferente del mismo curso.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>`,
  },
  {
    type: 'Cambio de Jornada' as TipoTramite,
    description: 'Modifica tu horario entre jornada mañana, tarde o noche.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>`,
  },
  {
    type: 'Curso Dirigido' as TipoTramite,
    description: 'Solicitud especial para materias con tutoría personalizada.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
    </svg>`,
  },
  {
    type: 'Adición de Curso' as TipoTramite,
    description: 'Agrega una materia adicional a tu carga académica actual.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>`,
  },
]
</script>

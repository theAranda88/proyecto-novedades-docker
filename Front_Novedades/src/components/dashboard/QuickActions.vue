<template>
  <div class="grid grid-cols-4 gap-4 mb-6">
    <button
      v-for="(action, i) in actions"
      :key="action.type"
      @click="selectAction(i, action.type)"
      :class="[
        'rounded-sm border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1 group',
        selected === i
          ? 'border-blue-400 bg-blue-50 shadow-md shadow-blue-100'
          : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
      ]"
    >
      <div
        class="mb-3 flex h-[42px] w-[42px] transition-transform duration-200 group-hover:scale-110
               origin-left items-center justify-center rounded-xl bg-blue-100 text-blue-700"
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
import { ref } from 'vue'
import type { TipoTramite } from '../../types'

const selected = ref<number | null>(null)

const emit = defineEmits<{ seleccionar: [tipo: TipoTramite] }>()

const selectAction = (index: number, tipo: TipoTramite) => {
  selected.value = index
  emit('seleccionar', tipo)
}

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
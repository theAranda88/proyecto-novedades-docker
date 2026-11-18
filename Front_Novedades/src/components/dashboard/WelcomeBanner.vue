<template>
  <section class="bienvenida isolate relative mb-8 overflow-hidden rounded-2xl bg-[#163251] px-5 py-8 text-white shadow-sm sm:px-8 sm:py-10 lg:px-10">
    <div class="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div class="min-w-0">
        <p class="mb-3 text-xs font-bold tracking-widest text-[#f6be86] uppercase">Portal estudiantil</p>
        <h1 class="font-brand text-2xl leading-tight text-white! sm:text-3xl xl:text-4xl">
          ¡Hola de nuevo, {{ student?.nombre || 'Estudiante' }}!
        </h1>
        <ul v-if="student" class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#dbe7f5]">
          <li v-if="student.carrera || student.programa">{{ student.carrera || student.programa }}</li>
          <li v-if="student.semestre">Semestre {{ student.semestre }}</li>
          <li v-if="student.codigo">Código {{ student.codigo }}</li>
        </ul>
      </div>
      <button
        type="button"
        class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#f6be86] px-4 py-2.5 text-sm font-bold text-[#172f48] transition-colors hover:bg-[#ffdaa9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        @click="$emit('nueva-solicitud')"
      >
        <span aria-hidden="true" class="text-lg leading-none">+</span>
        Nueva solicitud
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../store/authStore'

const { student } = storeToRefs(useAuthStore())
defineEmits<{ 'nueva-solicitud': [] }>()
</script>

<style scoped>
.bienvenida {
  background-image: radial-gradient(ellipse at 100% 115%, #315a83, transparent 70%);
}

.bienvenida::before,
.bienvenida::after {
  position: absolute;
  right: -6rem;
  bottom: -18rem;
  width: 29rem;
  aspect-ratio: 1;
  border: 1px solid rgb(218 232 248 / 22%);
  border-radius: 50%;
  pointer-events: none;
  content: '';
}

.bienvenida::after {
  right: -3rem;
  bottom: -16rem;
}
</style>

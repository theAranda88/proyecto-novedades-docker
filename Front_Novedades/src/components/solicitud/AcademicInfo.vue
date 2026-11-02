<template>
  <section class="bg-white border border-slate-200 rounded-xl p-6">
    <div class="flex items-center gap-2 mb-4">
      <div class="bg-slate-100 p-2 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <h2 class="text-sm font-bold text-slate-700">Información Académica</h2>
        <p class="text-xs text-slate-400">Estos datos han sido cargados automáticamente desde su registro institucional.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
        <p class="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Nombre Completo
        </p>
        <p class="text-sm font-semibold text-slate-700">{{ student?.nombre || '—' }}</p>
      </div>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
        <p class="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Codigo Estudiantil
        </p>
        <p class="text-sm font-semibold text-slate-700">{{ student?.codigo || '—' }}</p>
      </div>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
        <p class="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          Programa Academico
        </p>
        <p class="text-sm font-semibold text-slate-700">{{ student?.carrera || student?.programa || '—' }}</p>
      </div>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
        <p class="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Semestre Actual
        </p>
        <p class="text-sm font-semibold text-slate-700">{{ student?.semestre ? `${student.semestre}º Semestre` : '—' }}</p>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { StudentInfo } from '../../types'

defineProps<{ student: StudentInfo | null }>()
</script>
<template>
  <DashboardLayout>
    <template #header>
      <AppHeader />
    </template>
    <template #sidebar>
      <AppSidebar @logout="handleLogout" />
    </template>

    <div class="max-w-xl mx-auto space-y-5 pb-10">

      <!-- ─── Header de perfil ─────────────────────────────────── -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-3 text-center shadow-sm">
        <!-- Avatar con iniciales -->
        <div class="relative">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold select-none shadow-inner">
            {{ iniciales }}
          </div>
          <span
            class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center"
          >
            <span
              class="w-4 h-4 rounded-full"
              :class="perfil?.matricula_activa ? 'bg-emerald-400' : 'bg-slate-300'"
            ></span>
          </span>
        </div>

        <!-- Nombre -->
        <div>
          <h1 class="text-xl font-bold text-slate-800">
            {{ perfil?.nombre_completo || student?.nombre || 'Estudiante' }}
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">{{ perfil?.email_institucional || student?.email }}</p>
        </div>

        <!-- Badge estado matrícula -->
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          :class="perfil?.matricula_activa
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="perfil?.matricula_activa ? 'bg-emerald-500' : 'bg-slate-400'"></span>
          {{ perfil?.matricula_activa ? 'Matrícula Activa' : 'Sin Matrícula Activa' }}
        </span>
      </div>

      <!-- ─── Información Académica ─────────────────────────────── -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div class="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0121 21H3a12.083 12.083 0 012.84-10.422L12 14z"/>
            </svg>
          </div>
          <h2 class="text-sm font-bold text-slate-700">Información Académica</h2>
        </div>

        <div class="divide-y divide-slate-50">
          <!-- Código -->
          <div class="flex items-center gap-3 px-5 py-3.5">
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Código</p>
              <p class="text-sm font-semibold text-slate-800">{{ perfil?.cod_alumno || student?.codigo || '—' }}</p>
            </div>
          </div>

          <!-- Programa -->
          <div class="flex items-center gap-3 px-5 py-3.5">
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Programa</p>
              <p class="text-sm font-semibold text-slate-800">{{ perfil?.programa || student?.programa || student?.carrera || '—' }}</p>
            </div>
          </div>

          <!-- Semestre -->
          <div class="flex items-center gap-3 px-5 py-3.5">
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Semestre</p>
              <p class="text-sm font-semibold text-slate-800">
                {{ perfil?.semestre || student?.semestre ? `${perfil?.semestre || student?.semestre} semestre` : '—' }}
              </p>
            </div>
          </div>

          <!-- Jornada -->
          <div class="flex items-center gap-3 px-5 py-3.5">
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Jornada</p>
              <p class="text-sm font-semibold text-slate-800">{{ perfil?.jornada ? capitalize(perfil.jornada) : student?.jornada ? capitalize(student.jornada) : '—' }}</p>
            </div>
          </div>

          <!-- Créditos -->
          <div class="px-5 py-3.5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs text-slate-500 font-medium">Créditos inscritos</p>
              <p class="text-xs font-bold text-slate-700">
                <span :class="perfil ? 'text-blue-600' : 'text-slate-400'">{{ perfil?.creditos_inscritos ?? 0 }}</span>
                <span class="text-slate-400"> / {{ perfil?.creditos_max_permitidos ?? 20 }}</span>
              </p>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-700"
                :class="porcentajeCreditos >= 90 ? 'bg-red-400' : porcentajeCreditos >= 70 ? 'bg-amber-400' : 'bg-blue-500'"
                :style="{ width: `${Math.min(porcentajeCreditos, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Materias Matriculadas ─────────────────────────────── -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h2 class="text-sm font-bold text-slate-700">Materias Matriculadas</h2>
          </div>
          <span class="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-0.5 rounded-full">
            {{ materiasMatriculadas.length }}
          </span>
        </div>

        <!-- Skeleton cargando -->
        <div v-if="cargandoMaterias" class="p-4 space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3 items-start">
            <div class="w-9 h-9 bg-slate-100 rounded-lg shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-slate-100 rounded w-3/4"></div>
              <div class="h-2 bg-slate-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Sin materias -->
        <div v-else-if="!cargandoMaterias && materiasMatriculadas.length === 0" class="px-5 py-8 text-center">
          <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <p class="text-sm text-slate-400 font-medium">Sin materias matriculadas</p>
          <p class="text-xs text-slate-300 mt-1">No se encontraron materias para este período</p>
          <p v-if="diagnosticoMaterias" class="text-[11px] text-slate-400 mt-2 max-w-md mx-auto">
            {{ diagnosticoMaterias }}
          </p>
        </div>

        <!-- Lista de materias -->
        <ul v-else class="divide-y divide-slate-50">
          <li
            v-for="(materia, idx) in materiasMatriculadas"
            :key="materia.id"
            class="flex items-start gap-3 px-5 py-4 hover:bg-slate-50/60 transition-colors"
          >
            <!-- Número -->
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
              :class="colorBadge(idx)">
              {{ idx + 1 }}
            </div>

            <!-- Info materia -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800 truncate">{{ materia.nombre_curso }}</p>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ materia.codigo_grupo }} · {{ materia.docente }}
              </p>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span class="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ materia.dia_semana }} {{ materia.hora_inicio.slice(0,5) }}–{{ materia.hora_fin.slice(0,5) }}
                </span>
                <span v-if="materia.aula" class="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  Aula {{ materia.aula }}
                </span>
                <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                  :class="capitalize(materia.jornada) === 'Mañana' ? 'bg-amber-50 text-amber-600' : capitalize(materia.jornada) === 'Tarde' ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'">
                  {{ capitalize(materia.jornada) }}
                </span>
              </div>
            </div>

            <!-- Cupos -->
            <div class="text-right shrink-0">
              <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Cupos</p>
              <p class="text-sm font-bold"
                :class="materia.cupos_disponibles === 0 ? 'text-red-500' : materia.cupos_disponibles <= 5 ? 'text-amber-500' : 'text-emerald-600'">
                {{ materia.cupos_disponibles }}
              </p>
              <p class="text-[10px] text-slate-300">/ {{ materia.cupo_maximo }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- ─── Opciones ──────────────────────────────────────────── -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-50">

        <!-- Cambiar contraseña -->
        <button
          class="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
          @click="router.push({ name: 'ChangePassword' })"
        >
          <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <span class="flex-1 text-sm font-medium text-slate-700">Cambiar Contraseña</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Ir a Nueva Solicitud -->
        <button
          class="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
          @click="router.push({ name: 'NewApplication' })"
        >
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="flex-1 text-sm font-medium text-slate-700">Nueva Solicitud</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Mi Historial -->
        <button
          class="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
          @click="router.push({ name: 'History' })"
        >
          <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="flex-1 text-sm font-medium text-slate-700">Mi Historial</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- ─── Cerrar Sesión ─────────────────────────────────────── -->
      <button
        class="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold
               border-2 border-red-200 text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
        @click="handleLogout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Cerrar Sesión
      </button>

      <!-- Versión -->
      <p class="text-center text-[10px] text-slate-300 pb-2">Novedades Autónoma v1.0.0</p>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import DashboardLayout from '../components/dashboard/DashboardLayout.vue'
import AppHeader from '../components/dashboard/AppHeader.vue'
import AppSidebar from '../components/dashboard/AppSidebar.vue'

import { useAuthStore } from '../store/authStore'
import estudianteService from '../services/estudianteService'
import type { PerfilAcademico, MateriaMatriculada } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const { student } = storeToRefs(authStore)

const perfil = ref<PerfilAcademico | null>(null)
const materiasMatriculadas = ref<MateriaMatriculada[]>([])
const cargandoMaterias = ref(true)
const diagnosticoMaterias = ref('')

const iniciales = computed(() => {
  const nombre = perfil.value?.nombre_completo || student.value?.nombre || ''
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
    || 'E'
})

const porcentajeCreditos = computed(() => {
  if (!perfil.value?.creditos_max_permitidos) return 0
  return Math.round((perfil.value.creditos_inscritos / perfil.value.creditos_max_permitidos) * 100)
})

function capitalize(str: string): string {
  if (!str) return ''
  const map: Record<string, string> = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' }
  return map[str.toLowerCase()] || str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const colores = [
  'bg-blue-50 text-blue-600',
  'bg-indigo-50 text-indigo-600',
  'bg-violet-50 text-violet-600',
  'bg-cyan-50 text-cyan-600',
  'bg-teal-50 text-teal-600',
  'bg-emerald-50 text-emerald-600',
]

function colorBadge(idx: number): string {
  return colores[idx % colores.length]
}

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}

onMounted(async () => {
  // Cargar perfil académico
  try {
    perfil.value = await estudianteService.getPerfilAcademico()
  } catch {
    // Usar datos del store como fallback
  }

  // Cargar materias matriculadas
  try {
    materiasMatriculadas.value = await estudianteService.getMateriasMatriculadas()
    if (materiasMatriculadas.value.length === 0) {
      diagnosticoMaterias.value = 'No hay materias para este estudiante o el backend no expuso la lista de matrícula en el token/perfil actual.'
    }
  } catch {
    diagnosticoMaterias.value = 'No fue posible consultar materias matriculadas desde la API.'
  } finally {
    cargandoMaterias.value = false
  }
})
</script>

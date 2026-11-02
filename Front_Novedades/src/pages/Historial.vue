<template>
  <DashboardLayout>

    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Historial de Solicitudes</h1>
        <p class="text-sm text-slate-400 mt-1">Consulta el estado y seguimiento de tus trámites académicos activos y pasados.</p>
      </div>
    </div>

    <!-- Search + filtros pill -->
    <div class="flex items-center gap-3 mb-7">
      <!-- Buscador -->
      <div class="relative flex-1">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por tipo de solicitud o código (ej: CJ-2023)..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          @input="page = 1"
        />
      </div>

      <!-- Filtros pill -->
      <div class="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
        <svg class="text-slate-400 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span class="text-[11px] font-semibold text-slate-400 mr-1">Filtrar por:</span>
        <button
          v-for="f in FILTROS"
          :key="f.value"
          @click="setFiltro(f.value)"
          :class="[
            'px-3 py-1 rounded-lg text-[12.5px] font-semibold transition-all',
            filtro === f.value
              ? estadoPillActive(f.value)
              : 'text-slate-500 hover:bg-slate-100'
          ]"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-24">
      <svg class="animate-spin w-7 h-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>

    <!-- Error -->
    <AlertMessage v-else-if="error" :message="error" class="mb-4" />

    <!-- Empty state -->
    <div v-else-if="!paginated.length" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <p class="text-[14px] font-semibold text-slate-600 mb-1">No se encontraron solicitudes</p>
      <p class="text-sm text-slate-400">{{ search || filtro ? 'Intenta con otros filtros o términos.' : 'Aún no has enviado ningún trámite.' }}</p>
    </div>

    <!-- Grid de cards 3 columnas -->
    <div v-else class="grid grid-cols-3 gap-4">
      <div
        v-for="s in paginated"
        :key="s.id"
        class="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col hover:shadow-md hover:-translate-y-px transition-all duration-200 overflow-hidden"
      >
        <!-- Card header -->
        <div class="px-5 pt-5 pb-4 flex-1">
          <!-- ID + Badge estado -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11.5px] font-mono font-semibold text-slate-400 tracking-wide">{{ s.id }}</span>
            <span :class="['flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full', estadoBadge(s.estado)]">
              <span :class="['w-1.5 h-1.5 rounded-full', estadoDot(s.estado)]" />
              {{ s.estado }}
            </span>
          </div>

          <!-- Título -->
          <h3 class="text-[17px] font-bold text-slate-800 tracking-tight mb-2">{{ s.tipo }}</h3>

          <!-- Descripción -->
          <p class="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-5">
            {{ s.descripcion ?? descripcionFallback(s.tipo) }}
          </p>

          <!-- Meta: Fecha + Facultad -->
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Fecha
              </div>
              <p class="text-[13px] font-semibold text-slate-700">{{ s.fechaEnvio }}</p>
            </div>
            <div>
              <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Facultad
              </div>
              <p class="text-[13px] font-semibold text-slate-700 truncate">{{ s.facultad ?? 'Facultad de Ingeniería' }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
      <p class="text-[12.5px] text-slate-400">
        Mostrando <span class="font-semibold text-slate-600">{{ filtered.length }}</span> de
        <span class="font-semibold text-slate-600">{{ filtered.length }}</span> resultados
      </p>

      <div class="flex items-center gap-1">
        <button
          @click="page--"
          :disabled="page === 1"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-500 border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Anterior
        </button>

        <template v-for="p in pageButtons" :key="p">
          <span v-if="p === '...'" class="px-2 text-slate-400 text-sm">...</span>
          <button
            v-else
            @click="page = Number(p)"
            :class="[
              'w-8 h-8 rounded-lg text-sm font-semibold transition-all',
              page === Number(p)
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-100'
            ]"
          >
            {{ p }}
          </button>
        </template>

        <button
          @click="page++"
          :disabled="page === totalPages"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-500 border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-all"
        >
          Siguiente
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Resultado total sin paginación -->
    <p v-else-if="!isLoading && !error && paginated.length" class="text-[12.5px] text-slate-400 mt-8 pt-5 border-t border-slate-100">
      Mostrando <span class="font-semibold text-slate-600">{{ filtered.length }}</span> de
      <span class="font-semibold text-slate-600">{{ solicitudes.length }}</span> resultados
    </p>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import solicitudesService from '../services/solicitudesService'
import type { Solicitud, EstadoSolicitud } from '../types'
import DashboardLayout from '../components/layout/Dashboardlayout.vue'
import AlertMessage from '../components/ui/AlertMessage.vue'

// ─── Constantes ──────────────────────────────────────────────────────────────
const PER_PAGE = 6

const FILTROS = [
  { label: 'Todos',      value: ''           },
  { label: 'Pendientes', value: 'Pendiente'  },
  { label: 'Aprobadas',  value: 'Aprobada'   },
  { label: 'Rechazadas', value: 'Rechazada'  },
] as const

// ─── Estado ──────────────────────────────────────────────────────────────────
const solicitudes = ref<Solicitud[]>([])
const isLoading   = ref(false)
const error       = ref<string | null>(null)
const search      = ref('')
const filtro      = ref<EstadoSolicitud | ''>('')
const page        = ref(1)

// ─── Fetch ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  isLoading.value = true
  try {
    solicitudes.value = await solicitudesService.getMisSolicitudes()
  } catch (err: unknown) {
    error.value = (err as { message?: string })?.message ?? 'No se pudo cargar el historial.'
  } finally {
    isLoading.value = false
  }
})

// Resetear página al cambiar filtros
watch([search, filtro], () => { page.value = 1 })

// ─── Computed ────────────────────────────────────────────────────────────────
const filtered = computed(() =>
  solicitudes.value.filter((s) => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || s.id.toLowerCase().includes(q) || s.tipo.toLowerCase().includes(q)
    const matchFiltro = !filtro.value || s.estado === filtro.value
    return matchSearch && matchFiltro
  }),
)

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)))

const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

const pageButtons = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const cur = page.value
  if (cur <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', cur - 1, cur, cur + 1, '...', total]
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function setFiltro(val: EstadoSolicitud | '') {
  filtro.value = val
}

function estadoBadge(estado: EstadoSolicitud): string {
  const map: Record<EstadoSolicitud, string> = {
    'Aprobada':    'bg-green-50 text-green-700',
    'Rechazada':   'bg-red-100 text-red-600',
    'En proceso':  'bg-blue-50 text-blue-600',
    'Pendiente':   'bg-amber-50 text-amber-600',
    'En Revisión': 'bg-purple-50 text-purple-600',
  }
  return map[estado] ?? 'bg-slate-100 text-slate-500'
}

function estadoDot(estado: EstadoSolicitud): string {
  const map: Record<EstadoSolicitud, string> = {
    'Aprobada':    'bg-green-500',
    'Rechazada':   'bg-red-500',
    'En proceso':  'bg-blue-500',
    'Pendiente':   'bg-amber-400',
    'En Revisión': 'bg-purple-500',
  }
  return map[estado] ?? 'bg-slate-400'
}

function estadoPillActive(val: string): string {
  if (!val) return 'bg-slate-800 text-white'
  const map: Record<string, string> = {
    'Pendiente': 'bg-amber-100 text-amber-700',
    'Aprobada':  'bg-green-100 text-green-700',
    'Rechazada': 'bg-red-100 text-red-600',
  }
  return map[val] ?? 'bg-indigo-100 text-indigo-700'
}

function descripcionFallback(tipo: string): string {
  const map: Record<string, string> = {
    'Cambio de Curso':    'Solicitud de cambio a una sección diferente del mismo curso.',
    'Cambio de Jornada':  'Solicitud de cambio de jornada diurna a nocturna por motivos laborales.',
    'Curso Dirigido':     'Solicitud de curso dirigido con tutoría personalizada.',
    'Adición de Curso':   'Adición de asignatura adicional a la carga académica.',
    'Cancelación de Semestre': 'Cancelación total del semestre por calamidad doméstica.',
    'Examen Supletorio':  'Supletorio del parcial final de la asignatura.',
    'Cambio de Programa': 'Traslado entre programas académicos de la institución.',
  }
  return map[tipo] ?? 'Solicitud académica en proceso de revisión.'
}
</script>
<template>
  <DashboardLayout>
    <div class="mb-7 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Mi Historial</h1>
        <p class="text-sm text-slate-400 mt-1">Todas tus solicitudes académicas enviadas.</p>
      </div>
      <RouterLink :to="{ name: 'NuevaSolicitud' }">
        <button class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all">
          + Nueva Solicitud
        </button>
      </RouterLink>
    </div>

    <!-- Search + Filters -->
    <div class="flex gap-3 mb-6">
      <div class="relative flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" type="text" placeholder="Buscar por ID o tipo..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <select v-model="filterEstado" class="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">Todos los estados</option>
        <option v-for="s in ESTADOS" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <svg class="animate-spin w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{{ error }}</div>

    <!-- Empty -->
    <div v-else-if="!filtered.length" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <p class="text-slate-500 font-medium">No hay solicitudes</p>
      <p class="text-sm text-slate-400 mt-1">{{ search || filterEstado ? 'Prueba con otros filtros.' : 'Aún no has enviado ningún trámite.' }}</p>
    </div>

    <!-- Grid de cards -->
    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="s in paginated"
        :key="s.id"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">
            {{ tipoEmoji(s.tipo) }}
          </div>
          <div>
            <p class="text-[13px] font-bold text-slate-800">{{ s.tipo }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ s.id }} · {{ s.fechaEnvio }}</p>
          </div>
        </div>
        <span :class="['text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full', estadoClass(s.estado)]">
          {{ s.estado }}
        </span>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button @click="page--" :disabled="page === 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">‹ Ant</button>
      <span class="text-sm text-slate-500">{{ page }} / {{ totalPages }}</span>
      <button @click="page++" :disabled="page === totalPages" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">Sig ›</button>
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import solicitudesService, { QUICK_ACTIONS } from '../services/solicitudesService'
import type { Solicitud, EstadoSolicitud, TipoTramite } from '../types'
import DashboardLayout from '../components/layout/Dashboardlayout.vue'

const route = useRoute()
const ESTADOS: EstadoSolicitud[] = ['En proceso', 'Aprobada', 'Rechazada', 'Pendiente', 'En Revisión']
const PER_PAGE = 8

const solicitudes = ref<Solicitud[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const filterEstado = ref<EstadoSolicitud | ''>('')
const page = ref(1)

// ─── Cargar solicitudes ───────────────────────────────────────────────
async function cargarSolicitudes() {
  isLoading.value = true
  error.value = null
  try {
    console.log('📚 Cargando solicitudes del historial...')
    solicitudes.value = await solicitudesService.getMisSolicitudes()
    console.log('✅ Solicitudes cargadas:', solicitudes.value.length)
  } catch (err: unknown) {
    console.error('❌ Error cargando solicitudes:', err)
    error.value = (err as { message?: string })?.message ?? 'No se pudo cargar el historial.'
  } finally {
    isLoading.value = false
  }
}

// Cargar al montar el componente
onMounted(() => {
  cargarSolicitudes()
})

// Recargar cuando la ruta cambia (ej: después de enviar solicitud y redirigir)
watch(() => route.name, () => {
  if (route.name === 'MiHistorial') {
    console.log('🔄 Recargando solicitudes desde la ruta...')
    cargarSolicitudes()
  }
})

const filtered = computed(() => {
  return solicitudes.value.filter((s) => {
    const matchSearch =
      !search.value ||
      s.id.toLowerCase().includes(search.value.toLowerCase()) ||
      s.tipo.toLowerCase().includes(search.value.toLowerCase())
    const matchEstado = !filterEstado.value || s.estado === filterEstado.value
    return matchSearch && matchEstado
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / PER_PAGE))
const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filtered.value.slice(start, start + PER_PAGE)
})

function estadoClass(estado: EstadoSolicitud): string {
  const map: Record<EstadoSolicitud, string> = {
    'Aprobada':    'bg-green-50 text-green-600',
    'Rechazada':   'bg-red-50 text-red-500',
    'En proceso':  'bg-blue-50 text-blue-600',
    'Pendiente':   'bg-amber-50 text-amber-600',
    'En Revisión': 'bg-purple-50 text-purple-600',
  }
  return map[estado] ?? 'bg-slate-100 text-slate-500'
}

function tipoEmoji(tipo: TipoTramite | string): string {
  const action = QUICK_ACTIONS.find((a) => a.type === tipo)
  return action?.emoji ?? '📋'
}
</script>

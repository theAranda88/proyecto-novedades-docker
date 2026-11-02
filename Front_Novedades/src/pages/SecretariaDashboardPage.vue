<template>
  <SecretariaLayout>

    <!-- ── Page header ── -->
    <div class="flex items-start justify-between mb-7">
      <div>
        <h1 class="text-[22px] font-bold text-slate-800 tracking-tight">Gestión de Solicitudes</h1>
        <p class="text-sm text-slate-400 mt-1">Monitoreo y procesamiento de trámites académicos estudiantiles.</p>
      </div>
    </div>

    <!-- ── Stats ── -->
    <div class="grid grid-cols-2 gap-4 mb-7">

      <!-- Total Pendientes -->
      <div class="bg-white border border-slate-200 rounded-2xl px-7 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Total Pendientes</p>
          <div v-if="loadingStats" class="h-10 w-20 bg-slate-100 rounded-xl animate-pulse mb-2" />
          <p v-else class="text-[38px] font-bold text-slate-900 tracking-tight leading-none mb-2">
            {{ stats?.totalPendientes ?? 0 }}
          </p>
          <p class="text-[12px] text-slate-400">
            +{{ stats?.nuevasUltimaHora ?? 0 }} recibidas en la última hora
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
      </div>

      <!-- Aprobadas Hoy -->
      <div class="bg-white border border-slate-200 rounded-2xl px-7 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Aprobadas Hoy</p>
          <div v-if="loadingStats" class="h-10 w-20 bg-slate-100 rounded-xl animate-pulse mb-2" />
          <p v-else class="text-[38px] font-bold text-slate-900 tracking-tight leading-none mb-2">
            {{ stats?.aprobadasHoy ?? 0 }}
          </p>
          <p class="text-[12px] text-slate-400">
            {{ stats?.metaDiariaPercent ?? 0 }}% de la meta diaria alcanzada
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
      </div>

    </div>

    <!-- ── Bandeja de entrada ── -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      <!-- Cabecera -->
      <div class="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100">
        <h2 class="text-[15px] font-bold text-slate-800">Bandeja de Entrada</h2>
        <span class="text-[12px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Mostrando {{ rangoLabel }} de {{ total }} registros
        </span>
      </div>

      <!-- Barra de filtros -->
      <div class="px-6 py-3.5 border-b border-slate-100 flex items-center gap-3">

        <!-- Buscador -->
        <div class="relative flex-1">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por nombre, código o ID de solicitud..."
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
            @input="onFilterChange"
          />
        </div>

        <!-- Selector programa -->
        <div class="relative">
          <select
            v-model="filterPrograma"
            @change="onFilterChange"
            class="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
          >
            <option value="">Todos los programas</option>
            <option v-for="p in PROGRAMAS" :key="p" :value="p">{{ p }}</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <!-- Selector estado -->
        <div class="relative">
          <select
            v-model="filterEstado"
            @change="onFilterChange"
            class="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option v-for="e in ESTADOS" :key="e" :value="e">{{ e }}</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <!-- Filtro avanzado -->
        <button class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
        </button>

      </div>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[150px]">ID Solicitud</th>
              <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Estudiante</th>
              <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Trámite</th>
              <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Programa</th>
              <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[80px]">Fecha</th>
              <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[120px]">Estado</th>
              <th class="text-right px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[110px]">Acciones</th>
            </tr>
          </thead>

          <tbody>

            <!-- Skeleton loading -->
            <template v-if="loadingTabla">
              <tr v-for="i in PER_PAGE" :key="i" class="border-b border-slate-50">
                <td class="px-6 py-4"><div class="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
                    <div class="space-y-1.5">
                      <div class="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />
                      <div class="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4"><div class="h-6 w-28 bg-slate-100 rounded-full animate-pulse" /></td>
                <td class="px-4 py-4"><div class="h-4 w-28 bg-slate-100 rounded animate-pulse" /></td>
                <td class="px-4 py-4"><div class="h-4 w-14 bg-slate-100 rounded animate-pulse" /></td>
                <td class="px-4 py-4"><div class="h-4 w-20 bg-slate-100 rounded animate-pulse" /></td>
                <td class="px-6 py-4"><div class="h-4 w-16 bg-slate-100 rounded animate-pulse ml-auto" /></td>
              </tr>
            </template>

            <!-- Filas de datos -->
            <template v-else>
              <tr
                v-for="s in solicitudes"
                :key="s.id"
                @click="router.push({ name: 'SecretariaDetalle', params: { id: s.id } })"
                class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >

                <!-- ID -->
                <td class="px-6 py-4">
                  <span
                    @click="router.push({ name: 'SecretariaDetalle', params: { id: s.id } })"
                    class="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
                  >
                    {{ s.codigo_solicitud || s.id }}
                  </span>
                </td>

                <!-- Estudiante -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                      <img v-if="s.estudiante?.avatarUrl" :src="s.estudiante.avatarUrl" class="w-full h-full object-cover" alt="" />
                      <span v-else>{{ (s.estudiante?.nombre || s.estudiante_nombre || '?').charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-[13px] font-semibold text-slate-800 leading-tight">{{ s.estudiante?.nombre || s.estudiante_nombre || '—' }}</p>
                      <p class="text-[11.5px] text-slate-400 font-mono">{{ s.estudiante?.codigo || s.estudiante_codigo || '—' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Trámite chip -->
                <td class="px-4 py-4">
                  <span class="inline-block px-2.5 py-1 rounded-full border border-slate-200 text-[12px] font-semibold text-slate-600 bg-white whitespace-nowrap">
                    {{ s.tipo }}
                  </span>
                </td>

                <!-- Programa -->
                <td class="px-4 py-4">
                  <p class="text-[13px] text-slate-600 truncate max-w-[160px]">{{ s.programa }}</p>
                </td>

                <!-- Fecha -->
                <td class="px-4 py-4">
                  <p class="text-[13px] text-slate-600 whitespace-nowrap">{{ s.fechaEnvio }}</p>
                </td>

                <!-- Estado -->
                <td class="px-4 py-4">
                  <span :class="['text-[12px] font-bold px-2.5 py-1 rounded-full', estadoBadge(s.estado)]">
                    {{ s.estado }}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-1" @click.stop>

                    <!-- Aprobar / Rechazar solo para estados procesables -->
                    <template v-if="s.estado === 'Pendiente' || s.estado === 'En Revisión'">
                      <button
                        @click="aprobar(s.id)"
                        :disabled="procesando === s.id"
                        title="Aprobar"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-40 transition-all"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </button>
                      <button
                        @click="rechazar(s.id)"
                        :disabled="procesando === s.id"
                        title="Rechazar"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-all"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                      </button>
                    </template>

                    <!-- Ver detalle -->
                    <button
                      @click="router.push({ name: 'SecretariaDetalle', params: { id: s.id } })"
                      title="Ver detalle"
                      class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>

                    <!-- Más opciones -->
                    <button
                      title="Más opciones"
                      class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>

                  </div>
                </td>

              </tr>
            </template>

          </tbody>
        </table>
      </div>

      <!-- Footer tabla: contador + paginación -->
      <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p class="text-[12.5px] text-slate-400">
          Mostrando <span class="font-semibold text-slate-600">{{ rangoLabel }}</span> de
          <span class="font-semibold text-slate-600">{{ total }}</span> solicitudes
        </p>

        <div class="flex items-center gap-1">
          <button
            @click="page--"
            :disabled="page === 1"
            class="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-500 border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-all"
          >
            Anterior
          </button>

          <template v-for="p in pageButtons" :key="p">
            <span v-if="p === '...'" class="px-1.5 text-slate-400 text-sm select-none">...</span>
            <button
              v-else
              @click="page = Number(p)"
              :class="[
                'w-8 h-8 rounded-lg text-[13px] font-semibold transition-all',
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
            class="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-500 border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>

    </div>

  </SecretariaLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import solicitudesService from '../services/solicitudesService'
import type { SolicitudAdmin, DashboardStats, EstadoSolicitud } from '../types'
import SecretariaLayout from '../components/layout/SecretariaLayout.vue'

const router = useRouter()

// ─── Constantes ──────────────────────────────────────────────────────────────
const PER_PAGE = 5

const ESTADOS: EstadoSolicitud[] = [
  'Pendiente', 'En Revisión', 'En proceso', 'Aprobada', 'Rechazada',
]

const PROGRAMAS = [
  'Ingeniería de Sistemas',
  'Ingeniería Civil',
  'Derecho',
  'Medicina',
  'Administración de Empresas',
  'Psicología',
]

// ─── Estado reactivo ─────────────────────────────────────────────────────────
const stats          = ref<DashboardStats | null>(null)
const todasSolicitudes = ref<SolicitudAdmin[]>([])
const solicitudes    = ref<SolicitudAdmin[]>([])
const total          = ref(0)
const page           = ref(1)
const search         = ref('')
const filterPrograma = ref('')
const filterEstado   = ref<EstadoSolicitud | ''>('')
const loadingStats   = ref(false)
const loadingTabla   = ref(false)
const procesando     = ref<string | number | null>(null)

// ─── Mapear solicitud del backend al formato de la tabla ──────────────────────
function mapearSolicitud(raw: any): SolicitudAdmin {
  const programa = obtenerPrograma(raw)

  return {
    id: raw.id ?? raw.codigo_solicitud ?? '',
    id_estudiante: raw.id_estudiante ?? raw.estudiante_id ?? '',
    codigo_solicitud: raw.codigo_solicitud ?? `SOL-${raw.id}`,
    tipo: raw.tipo ?? raw.tipo_solicitud ?? '',
    estado: mapearEstado(raw.estado),
    fecha_creacion: raw.fecha_creacion ?? raw.created_at ?? '',
    fecha_actualizacion: raw.fecha_actualizacion ?? raw.updated_at ?? '',
    estudiante_nombre: raw.estudiante_nombre ?? raw.estudiante?.nombre ?? raw.nombre_estudiante ?? '',
    estudiante_codigo: raw.estudiante_codigo ?? raw.estudiante?.codigo ?? raw.codigo_estudiantil ?? '',
    descripcion: raw.descripcion ?? raw.justificacion ?? '',
    programa,
    fechaEnvio: formatearFecha(raw.fecha_creacion ?? raw.created_at ?? ''),
    estudiante: {
      nombre: raw.estudiante_nombre ?? raw.estudiante?.nombre ?? raw.nombre_estudiante ?? 'Sin nombre',
      codigo: raw.estudiante_codigo ?? raw.estudiante?.codigo ?? raw.codigo_estudiantil ?? '',
      programa,
      semestre: raw.semestre ?? raw.estudiante?.semestre ?? 0,
      promedio: raw.promedio ?? raw.estudiante?.promedio ?? '',
      email: raw.email ?? raw.estudiante?.email ?? '',
      avatarUrl: raw.avatarUrl ?? raw.estudiante?.avatarUrl,
    },
  }
}

function mapearEstado(estado: string): EstadoSolicitud {
  const mapa: Record<string, EstadoSolicitud> = {
    'PENDIENTE': 'Pendiente',
    'EN_REVISION': 'En Revisión',
    'EN_PROCESO': 'En proceso',
    'APROBADA': 'Aprobada',
    'RECHAZADA': 'Rechazada',
    'pendiente': 'Pendiente',
    'en_revision': 'En Revisión',
    'en_proceso': 'En proceso',
    'aprobada': 'Aprobada',
    'rechazada': 'Rechazada',
  }
  return mapa[estado] ?? estado as EstadoSolicitud
}

function formatearFecha(fecha: string): string {
  if (!fecha) return ''
  try {
    return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return fecha
  }
}

function obtenerPrograma(raw: any): string {
  return (
    raw.programa ??
    raw.nombre_programa ??
    raw.carrera ??
    raw.estudiante?.programa ??
    raw.estudiante?.nombre_programa ??
    raw.estudiante?.carrera ??
    '—'
  )
}

// ─── Carga inicial ────────────────────────────────────────────────────────────
onMounted(async () => {
  loadingStats.value = true
  loadingTabla.value = true
  try {
    const datosRaw = await solicitudesService.obtenerSolicitudes()
    console.log('📋 Solicitudes recibidas del backend:', datosRaw)
    
    const datos = (datosRaw as any[]).map(mapearSolicitud)
    console.log('📋 Solicitudes mapeadas:', datos)
    
    todasSolicitudes.value = datos
    aplicarFiltrosYPaginar()

    // Calcular stats desde los datos
    const pendientes = datos.filter(s => s.estado === 'Pendiente' || s.estado === 'En Revisión')
    const aprobadasHoy = datos.filter(s => {
      if (s.estado !== 'Aprobada') return false
      const hoy = new Date().toISOString().slice(0, 10)
      const fecha = s.fecha_actualizacion || s.fecha_creacion || ''
      return fecha.startsWith(hoy)
    })
    stats.value = {
      total_usuarios: 0,
      estudiantes: 0,
      secretarias: 0,
      administradores: 0,
      activos: 0,
      inactivos: 0,
      totalPendientes: pendientes.length,
      nuevasUltimaHora: 0,
      aprobadasHoy: aprobadasHoy.length,
      metaDiariaPercent: 0,
    }
  } catch (err) {
    console.error('❌ Error cargando solicitudes:', err)
  } finally {
    loadingStats.value = false
    loadingTabla.value = false
  }
})

// ─── Fetch al cambiar página ──────────────────────────────────────────────────
watch(page, aplicarFiltrosYPaginar)

function aplicarFiltrosYPaginar() {
  let filtradas = [...todasSolicitudes.value]

  if (search.value) {
    const q = search.value.toLowerCase()
    filtradas = filtradas.filter(s =>
      String(s.id).toLowerCase().includes(q) ||
      s.estudiante_nombre?.toLowerCase().includes(q) ||
      s.estudiante_codigo?.toLowerCase().includes(q) ||
      s.codigo_solicitud?.toLowerCase().includes(q) ||
      s.estudiante?.nombre?.toLowerCase().includes(q) ||
      s.estudiante?.codigo?.toLowerCase().includes(q)
    )
  }

  if (filterPrograma.value) {
    filtradas = filtradas.filter(s => s.programa === filterPrograma.value)
  }

  if (filterEstado.value) {
    filtradas = filtradas.filter(s => s.estado === filterEstado.value)
  }

  total.value = filtradas.length

  const start = (page.value - 1) * PER_PAGE
  solicitudes.value = filtradas.slice(start, start + PER_PAGE)
}

function onFilterChange() {
  page.value = 1
  aplicarFiltrosYPaginar()
}

// ─── Acciones fila ────────────────────────────────────────────────────────────
async function aprobar(id: number | string) {
  procesando.value = id
  try {
    await solicitudesService.actualizarEstado(id, { estado: 'aprobada' })
    const idx = solicitudes.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      const current = solicitudes.value[idx]
      if (current) {
        solicitudes.value[idx] = { ...current, estado: 'Aprobada' as EstadoSolicitud }
      }
    }
    // Actualizar también en la lista completa
    const idxAll = todasSolicitudes.value.findIndex(s => s.id === id)
    if (idxAll !== -1) {
      const c = todasSolicitudes.value[idxAll]
      if (c) todasSolicitudes.value[idxAll] = { ...c, estado: 'Aprobada' as EstadoSolicitud }
    }
  } finally {
    procesando.value = null
  }
}

async function rechazar(id: number | string) {
  procesando.value = id
  try {
    await solicitudesService.actualizarEstado(id, { estado: 'rechazada' })
    const idx = solicitudes.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      const current = solicitudes.value[idx]
      if (current) {
        solicitudes.value[idx] = { ...current, estado: 'Rechazada' as EstadoSolicitud }
      }
    }
    const idxAll = todasSolicitudes.value.findIndex(s => s.id === id)
    if (idxAll !== -1) {
      const c = todasSolicitudes.value[idxAll]
      if (c) todasSolicitudes.value[idxAll] = { ...c, estado: 'Rechazada' as EstadoSolicitud }
    }
  } finally {
    procesando.value = null
  }
}

// ─── Computed ────────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PER_PAGE)))

const rangoLabel = computed(() => {
  if (!total.value) return '0'
  const from = (page.value - 1) * PER_PAGE + 1
  const to   = Math.min(page.value * PER_PAGE, total.value)
  return `${from} a ${to}`
})

const pageButtons = computed(() => {
  const t = totalPages.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const c = page.value
  if (c <= 3) return [1, 2, 3, '...', t]
  if (c >= t - 2) return [1, '...', t - 2, t - 1, t]
  return [1, '...', c - 1, c, c + 1, '...', t]
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function estadoBadge(estado: EstadoSolicitud): string {
  const map: Record<EstadoSolicitud, string> = {
    'Aprobada':    'text-green-700',
    'Rechazada':   'bg-red-500 text-white',
    'En proceso':  'text-blue-600',
    'Pendiente':   'text-slate-500',
    'En Revisión': 'text-purple-600',
  }
  return map[estado] ?? 'text-slate-500'
}
</script>

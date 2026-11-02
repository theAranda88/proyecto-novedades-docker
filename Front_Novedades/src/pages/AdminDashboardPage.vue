<template>
  <SecretariaLayout>

    <!-- ── Page header ── -->
    <div class="flex items-start justify-between mb-7">
      <div>
        <h1 class="text-[22px] font-bold text-slate-800 tracking-tight">Gestión de Solicitudes</h1>
        <p class="text-sm text-slate-400 mt-1">Monitoreo y procesamiento de trámites académicos estudiantiles.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="exportarReporte"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar Reporte
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:-translate-y-px active:translate-y-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Revisión Masiva
        </button>
      </div>
    </div>

    <!-- ── Stats ── -->
    <div class="grid grid-cols-4 gap-4 mb-7">

      <!-- Total Usuarios -->
      <div class="bg-white border border-slate-200 rounded-2xl px-7 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Total Usuarios</p>
          <div v-if="loadingStats" class="h-10 w-20 bg-slate-100 rounded-xl animate-pulse mb-2" />
          <p v-else class="text-[38px] font-bold text-slate-900 tracking-tight leading-none mb-2">
            {{ stats?.total_usuarios ?? stats?.totalUsuarios ?? 0 }}
          </p>
          <p class="text-[12px] text-slate-400">
            En el sistema
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
      </div>

      <!-- Usuarios Activos -->
      <div class="bg-white border border-slate-200 rounded-2xl px-7 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Usuarios Activos</p>
          <div v-if="loadingStats" class="h-10 w-20 bg-slate-100 rounded-xl animate-pulse mb-2" />
          <p v-else class="text-[38px] font-bold text-slate-900 tracking-tight leading-none mb-2">
            {{ stats?.activos ?? stats?.usuariosActivos ?? 0 }}
          </p>
          <p class="text-[12px] text-slate-400">
            {{ porcentajeActivosLabel }}% del total
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
      </div>

      <!-- Total Pendientes -->
      <div class="bg-white border border-slate-200 rounded-2xl px-7 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Total Pendientes</p>
          <div v-if="loadingStats" class="h-10 w-20 bg-slate-100 rounded-xl animate-pulse mb-2" />
          <p v-else class="text-[38px] font-bold text-slate-900 tracking-tight leading-none mb-2">
            {{ stats?.totalPendientes ?? stats?.solicitudes_pendientes ?? 42 }}
          </p>
          <p class="text-[12px] text-slate-400">
            +{{ stats?.nuevasUltimaHora ?? 5 }} recibidas en la última hora
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
            {{ stats?.solicitudes_aprobadas ?? 128 }}
          </p>
          <p class="text-[12px] text-slate-400">
            {{ stats?.metaDiariaPercent ?? 85 }}% de la meta diaria
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
            <option value="">Pendientes</option>
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
                class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
              >

                <!-- ID -->
                <td class="px-6 py-4">
                  <span class="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">
                    {{ s.id }}
                  </span>
                </td>

                <!-- Estudiante -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                      <img v-if="s.estudiante.avatarUrl" :src="s.estudiante.avatarUrl" class="w-full h-full object-cover" alt="" />
                      <span v-else>{{ s.estudiante.nombre.charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-[13px] font-semibold text-slate-800 leading-tight">{{ s.estudiante.nombre }}</p>
                      <p class="text-[11.5px] text-slate-400 font-mono">{{ s.estudiante.codigo }}</p>
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
                  <p class="text-[13px] text-slate-600 whitespace-nowrap">{{ s.fecha }}</p>
                </td>

                <!-- Estado -->
                <td class="px-4 py-4">
                  <span :class="['text-[12px] font-bold px-2.5 py-1 rounded-full', estadoBadge(s.estado)]">
                    {{ s.estado }}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-1">

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
import adminService from '../services/adminService'
import usuariosService from '../services/usuariosService'
import type { SolicitudAdmin, DashboardStats, EstadoSolicitudAdmin } from '../types'
import SecretariaLayout from '../components/layout/SecretariaLayout.vue'

// ─── Constantes ──────────────────────────────────────────────────────────────
const PER_PAGE = 5

const ESTADOS: EstadoSolicitudAdmin[] = [
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
const solicitudes    = ref<SolicitudAdmin[]>([])
const total          = ref(0)
const page           = ref(1)
const search         = ref('')
const filterPrograma = ref('')
const filterEstado   = ref<EstadoSolicitudAdmin | ''>('')
const loadingStats   = ref(false)
const loadingTabla   = ref(false)
const procesando     = ref<string | null>(null)

function mergeStats(adminStats: DashboardStats | null, usuariosStats: Partial<DashboardStats> | null): DashboardStats | null {
  if (!adminStats && !usuariosStats) return null

  const totalUsuariosAdmin = adminStats?.total_usuarios ?? adminStats?.totalUsuarios ?? 0
  const totalUsuariosUsuarios = usuariosStats?.total_usuarios ?? usuariosStats?.totalUsuarios ?? 0
  const totalUsuarios = totalUsuariosAdmin > 0 ? totalUsuariosAdmin : totalUsuariosUsuarios

  const activosAdmin = adminStats?.activos ?? adminStats?.usuariosActivos ?? 0
  const activosUsuarios = usuariosStats?.activos ?? usuariosStats?.usuariosActivos ?? 0
  const activos = activosAdmin > 0 ? activosAdmin : activosUsuarios

  return {
    total_usuarios: totalUsuarios,
    totalUsuarios,
    estudiantes: adminStats?.estudiantes ?? usuariosStats?.estudiantes ?? 0,
    secretarias: adminStats?.secretarias ?? usuariosStats?.secretarias ?? 0,
    administradores: adminStats?.administradores ?? usuariosStats?.administradores ?? 0,
    activos,
    usuariosActivos: activos,
    inactivos: adminStats?.inactivos ?? usuariosStats?.inactivos ?? 0,
    solicitudes_pendientes: adminStats?.solicitudes_pendientes ?? 0,
    totalPendientes: adminStats?.totalPendientes ?? 0,
    solicitudes_aprobadas: adminStats?.solicitudes_aprobadas ?? 0,
    nuevasUltimaHora: adminStats?.nuevasUltimaHora ?? 0,
    crecimientoSemestre: adminStats?.crecimientoSemestre ?? 0,
    porcentajeActivos: adminStats?.porcentajeActivos,
    aprobadasHoy: adminStats?.aprobadasHoy ?? 0,
    metaDiariaPercent: adminStats?.metaDiariaPercent ?? 0,
  }
}

// ─── Carga inicial ────────────────────────────────────────────────────────────
onMounted(async () => {
  loadingStats.value = true
  loadingTabla.value = true
  try {
    const [statsData, usuariosStatsData, tablaData] = await Promise.all([
      adminService.getStats().catch(() => null),
      usuariosService.obtenerEstadisticas().catch(() => null),
      adminService.getSolicitudes({ page: 1, limit: PER_PAGE }),
    ])
    stats.value       = mergeStats(statsData, usuariosStatsData)
    solicitudes.value = tablaData.data
    total.value       = tablaData.total
  } catch {
    // Sin backend en dev: los valores fallback del template son suficientes
  } finally {
    loadingStats.value = false
    loadingTabla.value = false
  }
})

// ─── Fetch al cambiar página ──────────────────────────────────────────────────
watch(page, fetchTabla)

async function fetchTabla() {
  loadingTabla.value = true
  try {
    const res = await adminService.getSolicitudes({
      page:     page.value,
      limit:    PER_PAGE,
      search:   search.value   || undefined,
      programa: filterPrograma.value || undefined,
      estado:   filterEstado.value   || undefined,
    })
    solicitudes.value = res.data
    total.value       = res.total
  } catch {
    // silencio
  } finally {
    loadingTabla.value = false
  }
}

function onFilterChange() {
  page.value = 1
  fetchTabla()
}

// ─── Acciones fila ────────────────────────────────────────────────────────────
async function aprobar(id: string) {
  procesando.value = id
  try {
    await adminService.aprobar(id)
    const idx = solicitudes.value.findIndex(s => s.id === id)
    if (idx !== -1 && solicitudes.value[idx]) {
      solicitudes.value[idx].estado = 'Aprobada'
    }
  } finally {
    procesando.value = null
  }
}

async function rechazar(id: string) {
  procesando.value = id
  try {
    await adminService.rechazar(id)
    const idx = solicitudes.value.findIndex(s => s.id === id)
    if (idx !== -1 && solicitudes.value[idx]) {
      solicitudes.value[idx].estado = 'Rechazada'
    }
  } finally {
    procesando.value = null
  }
}

function exportarReporte() {
  adminService.exportarReporte().catch(() => {})
}

// ─── Computed ────────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PER_PAGE)))

const rangoLabel = computed(() => {
  if (!total.value) return '0'
  const from = (page.value - 1) * PER_PAGE + 1
  const to   = Math.min(page.value * PER_PAGE, total.value)
  return `${from} a ${to}`
})

const porcentajeActivosLabel = computed(() => {
  if (!stats.value) return 0
  const total = stats.value.total_usuarios || stats.value.totalUsuarios || 0
  const activos = stats.value.activos || stats.value.usuariosActivos || 0
  if (total === 0) return 0
  return Math.round((activos / total) * 100)
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
function estadoBadge(estado: EstadoSolicitudAdmin): string {
  const map: Record<EstadoSolicitudAdmin, string> = {
    'Aprobada':    'text-green-700',
    'Rechazada':   'bg-red-500 text-white',
    'En proceso':  'text-blue-600',
    'Pendiente':   'text-slate-500',
    'En Revisión': 'text-purple-600',
  }
  return map[estado] ?? 'text-slate-500'
}
</script>

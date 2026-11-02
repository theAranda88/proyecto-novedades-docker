<template>
  <DashboardLayout>
    <template #header>
      <DashboardHeader />
    </template>
    <template #sidebar>
      <DashboardSidebar @logout="handleLogout" />
    </template>

    <div class="space-y-6">

      <HistoryHeader />

      <HistoryFilters
        v-model:busqueda="busqueda"
        v-model:filtroActivo="filtroActivo"
      />

      <HistoryGrid
        :solicitudes="solicitudesPaginadas"
        @ver-detalle="verDetalle"
      />

      <PaginationHistory
        v-model:paginaActual="paginaActual"
        :total-paginas="totalPaginas"
        :mostrando="solicitudesPaginadas.length"
        :total="solicitudesFiltradas.length"
      />

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DashboardLayout from '../components/dashboard/DashboardLayout.vue'
import DashboardHeader from '../components/dashboard/AppHeader.vue'
import DashboardSidebar from '../components/dashboard/AppSidebar.vue'
import HistoryHeader from '../components/historial/HistoryHeader.vue'
import HistoryFilters from '../components/historial/HistoryFilters.vue'
import HistoryGrid from '../components/historial/HistoryGrid.vue'
import PaginationHistory from '../components/historial/PaginationHistory.vue'

import { useAuthStore } from '../store/authStore'
import solicitudesService from '../services/solicitudesService'
import type { EstadoSolicitud } from '../types'

const router = useRouter()
const authStore = useAuthStore()

// ─── Datos ────────────────────────────────────────────────────
const solicitudes = ref<any[]>([])
const isLoadingSolicitudes = ref(false)

function normalizarEstado(estadoRaw?: string): EstadoSolicitud {
  const estado = String(estadoRaw || '').trim().toLowerCase()

  if (estado === 'aprobada') return 'Aprobada'
  if (estado === 'rechazada') return 'Rechazada'
  if (estado === 'en revisión' || estado === 'en_revision') return 'En Revisión'
  if (estado === 'en proceso') return 'En proceso'
  if (estado === 'pendiente') return 'Pendiente'

  return 'Pendiente'
}

function obtenerJustificacionRechazo(solicitud: any): string {
  return (
    solicitud?.razon_rechazo ||
    solicitud?.razonRechazo ||
    solicitud?.observaciones ||
    solicitud?.observacion_secretaria ||
    solicitud?.justificacion_secretaria ||
    ''
  )
}

// Cargar solicitudes al montar
onMounted(async () => {
  console.log('📊 History: Cargando historial de solicitudes...')
  isLoadingSolicitudes.value = true
  try {
    const data = await solicitudesService.getMisSolicitudes()
    console.log('✅ Historial cargado:', data)

    solicitudes.value = (data || []).map((s: any) => ({
      id: String(s.codigo_solicitud || s.id || ''),
      tipo: s.tipo_solicitud || s.tipo || 'Solicitud Académica',
      descripcion: s.descripcion || s.justificacion || '',
      fechaEnvio: s.fecha_envio || s.fecha_creacion || s.created_at || new Date().toISOString(),
      facultad: s.facultad || s.programa || 'Facultad de Ingeniería',
      estado: normalizarEstado(s.estado),
      justificacionRechazo: obtenerJustificacionRechazo(s)
    }))
  } catch (error) {
    console.error('❌ Error al cargar historial:', error)
    solicitudes.value = []
  } finally {
    isLoadingSolicitudes.value = false
  }
})

// ─── Búsqueda y filtros ──────────────────────────────────────
const busqueda = ref('')
const filtroActivo = ref('Todos')

const solicitudesFiltradas = computed(() =>
  solicitudes.value.filter(s => {
    const coincideBusqueda =
      s.tipo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      s.id.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideFiltro = filtroActivo.value === 'Todos' || s.estado === filtroActivo.value
    return coincideBusqueda && coincideFiltro
  })
)

// ─── Paginación ──────────────────────────────────────────────
const paginaActual = ref(1)
const porPagina = 6

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(solicitudesFiltradas.value.length / porPagina))
)

const solicitudesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return solicitudesFiltradas.value.slice(inicio, inicio + porPagina)
})

watch([busqueda, filtroActivo], () => { paginaActual.value = 1 })

// ─── Handlers ────────────────────────────────────────────────
function verDetalle(id: string) {
  console.log('Ver detalle:', id)
  // TODO: router.push({ name: 'DetalleSolicitud', params: { id } })
}

async function handleLogout() {
  authStore.logout()
  await router.push({ name: 'Login' })
}
</script>
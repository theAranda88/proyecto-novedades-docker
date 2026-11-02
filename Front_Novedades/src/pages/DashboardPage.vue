<template>
  <DashboardLayout>

    <template #header>
      <DashboardHeader />
    </template>

    <template #sidebar>
      <DashboardSidebar @logout="handleLogout" />
    </template>

    <div>
      <!-- Saludo -->
      <WelcomeBanner @nueva-solicitud="router.push({ name: 'NewApplication' })" />

      <!-- Acciones rápidas -->
      <section class="mb-6">
        <div class="flex items-center gap-1 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-blue-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>
          </svg>
          <h3 class="text-sm font-semibold text-slate-800">Acciones Rápidas</h3>
        </div>
        <AccionesRapidas @seleccionar="handleSeleccionarAccion" />
      </section>

      <!-- Solicitudes recientes -->
      <RecentRequest
        :solicitudes="solicitudesMock"
        @ver-historial="router.push({ name: 'Historial' })"
        @ver-detalle="handleVerDetalle"
      />

      <!-- Información de Créditos -->
      <section v-if="perfil" class="mb-6">
        <div class="flex items-center gap-1 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-blue-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>
          </svg>
          <h3 class="text-sm font-semibold text-slate-800">Créditos Académicos</h3>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Créditos Inscritos</p>
              <p class="text-2xl font-bold text-slate-800">
                {{ perfil.creditos_inscritos }}
                <span class="text-sm font-normal text-slate-400">/ {{ perfil.creditos_max_permitidos }}</span>
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Disponibles</p>
              <p class="text-2xl font-bold" :class="perfil.creditos_max_permitidos - perfil.creditos_inscritos > 0 ? 'text-green-600' : 'text-red-500'">
                {{ perfil.creditos_max_permitidos - perfil.creditos_inscritos }}
              </p>
            </div>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-500"
              :class="porcentajeCreditos >= 90 ? 'bg-red-500' : porcentajeCreditos >= 70 ? 'bg-yellow-500' : 'bg-blue-500'"
              :style="{ width: `${Math.min(porcentajeCreditos, 100)}%` }"
            ></div>
          </div>
          <p class="text-xs text-slate-400 mt-1.5 text-right">{{ porcentajeCreditos }}% utilizado</p>
        </div>
      </section>

      <!-- Info cards -->
      <InfoCards />
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import DashboardLayout from '../components/dashboard/DashboardLayout.vue'
import DashboardHeader from '../components/dashboard/AppHeader.vue'
import DashboardSidebar from '../components/dashboard/AppSidebar.vue'
import AccionesRapidas from '../components/dashboard/QuickActions.vue'
import WelcomeBanner from '../components/dashboard/WelcomeBanner.vue'
import RecentRequest from '../components/dashboard/RecentRequest.vue'
import InfoCards from '../components/dashboard/InfoCards.vue'

import { useAuthStore } from '../store/authStore'
import solicitudesService from '../services/solicitudesService'
import estudianteService from '../services/estudianteService'
import type { TipoTramite, PerfilAcademico } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const { student } = storeToRefs(authStore)

const solicitudesMock = ref<any[]>([])
const isLoadingSolicitudes = ref(false)
const perfil = ref<PerfilAcademico | null>(null)

const porcentajeCreditos = computed(() => {
  if (!perfil.value || !perfil.value.creditos_max_permitidos) return 0
  return Math.round((perfil.value.creditos_inscritos / perfil.value.creditos_max_permitidos) * 100)
})

function formatearFecha(fecha: string): string {
  if (!fecha) return '—'

  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Cargar solicitudes y perfil al montar el componente
onMounted(async () => {
  console.log('📊 DashboardPage: Cargando datos del estudiante...')
  isLoadingSolicitudes.value = true
  try {
    const [solicitudes, perfilData] = await Promise.all([
      solicitudesService.getMisSolicitudes(),
      estudianteService.getPerfilAcademico().catch(() => null)
    ])
    
    console.log('✅ Solicitudes cargadas:', solicitudes)
    perfil.value = perfilData
    
    // Mapear la respuesta del backend al formato esperado
    solicitudesMock.value = (solicitudes || []).map((s: any) => ({
      id: s.codigo_solicitud || s.id,
      tipo: s.tipo || s.tipo_solicitud || s.tramite || '—',
      fechaEnvio: formatearFecha(s.fecha_creacion || s.created_at || s.fechaEnvio || s.fecha_envio || ''),
      estado: s.estado
    }))
  } catch (error) {
    console.error('❌ Error al cargar solicitudes:', error)
    // Mantener datos vacíos si hay error - no interrumpir la carga de la página
    solicitudesMock.value = []
  } finally {
    isLoadingSolicitudes.value = false
  }
})

function handleSeleccionarAccion(tipo: TipoTramite) {
  console.log('✅ Acción seleccionada:', tipo)
  // Navegar a la página de nueva solicitud con el tipo seleccionado como query param
  router.push({ 
    name: 'NewApplication',
    query: { tipo }
  })
}

function handleVerDetalle(id: string) {
  console.log('Detalle:', id)
  // TODO: router.push({ name: 'DetalleSolicitud', params: { id } })
}

async function handleLogout() {
  authStore.logout()
  await router.push({ name: 'Login' })
}
</script>
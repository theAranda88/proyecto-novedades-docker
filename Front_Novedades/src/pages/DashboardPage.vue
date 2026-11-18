<template>
  <DashboardLayout>
    <template #header>
      <DashboardHeader />
    </template>

    <template #sidebar>
      <DashboardSidebar @logout="handleLogout" />
    </template>

    <div class="mx-auto max-w-7xl">
      <WelcomeBanner @nueva-solicitud="router.push({ name: 'NewApplication' })" />

      <section class="mb-8" aria-labelledby="acciones-rapidas">
        <h2 id="acciones-rapidas" class="mb-3 text-lg font-bold">Acciones rápidas</h2>
        <AccionesRapidas @seleccionar="handleSeleccionarAccion" />
      </section>

      <div class="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_18rem]">
        <RecentRequest :solicitudes="solicitudes" :cargando="isLoadingSolicitudes" :error="errorSolicitudes" />

        <section v-if="perfil" aria-labelledby="creditos-academicos" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 id="creditos-academicos" class="mb-4 text-lg font-bold">Créditos académicos</h2>
          <dl class="mb-3 flex items-center justify-between gap-3">
            <div>
              <dt class="text-xs font-semibold text-slate-500">Inscritos</dt>
              <dd class="text-2xl font-bold text-slate-800">
                {{ perfil.creditos_inscritos }}
                <span class="text-sm font-normal text-slate-500">/ {{ perfil.creditos_max_permitidos }}</span>
              </dd>
            </div>
            <div class="text-right">
              <dt class="text-xs font-semibold text-slate-500">Disponibles</dt>
              <dd class="text-2xl font-bold" :class="creditosDisponibles > 0 ? 'text-green-600' : 'text-red-600'">
                {{ creditosDisponibles }}
              </dd>
            </div>
          </dl>
          <div class="h-2.5 rounded-full bg-blue-50" aria-hidden="true">
            <div
              class="h-full rounded-full"
              :class="porcentajeCreditos >= 90 ? 'bg-red-500' : porcentajeCreditos >= 70 ? 'bg-yellow-500' : 'bg-blue-500'"
              :style="{ width: `${Math.min(porcentajeCreditos, 100)}%` }"
            ></div>
          </div>
          <p class="mt-2 text-right text-xs text-slate-500">{{ porcentajeCreditos }}% utilizado</p>
        </section>
      </div>

      <InfoCards />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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
import { etiquetaSolicitud } from '../utils/solicitudDisplay'
import type { PerfilAcademico, TipoTramite } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const solicitudes = ref<{ id: string; tipo: string; fechaEnvio: string; estado: string }[]>([])
const isLoadingSolicitudes = ref(true)
const errorSolicitudes = ref(false)
const perfil = ref<PerfilAcademico | null>(null)

const creditosDisponibles = computed(() => {
  if (!perfil.value) return 0
  return perfil.value.creditos_max_permitidos - perfil.value.creditos_inscritos
})

const porcentajeCreditos = computed(() => {
  if (!perfil.value?.creditos_max_permitidos) return 0
  return Math.round((perfil.value.creditos_inscritos / perfil.value.creditos_max_permitidos) * 100)
})

function formatearFecha(fecha?: string): string {
  if (!fecha) return '—'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  await Promise.all([cargarSolicitudes(), cargarPerfil()])
})

async function cargarSolicitudes() {
  try {
    const datos = await solicitudesService.getMisSolicitudes(undefined, { propagarError: true })
    solicitudes.value = datos.slice(0, 5).map(solicitud => ({
      id: String(solicitud.codigo_solicitud || solicitud.id),
      tipo: etiquetaSolicitud(solicitud.tipo || solicitud.tipo_solicitud || solicitud.tramite),
      fechaEnvio: formatearFecha(solicitud.fecha_creacion || solicitud.created_at || solicitud.fechaEnvio || solicitud.fecha_envio),
      estado: etiquetaSolicitud(solicitud.estado),
    }))
  } catch {
    errorSolicitudes.value = true
  } finally {
    isLoadingSolicitudes.value = false
  }
}

async function cargarPerfil() {
  perfil.value = await estudianteService.getPerfilAcademico().catch(() => null)
}

function handleSeleccionarAccion(tipo: TipoTramite) {
  router.push({ name: 'NewApplication', query: { tipo } })
}

async function handleLogout() {
  authStore.logout()
  await router.push({ name: 'Login' })
}
</script>

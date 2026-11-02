<template>
  <div class="min-h-screen bg-slate-50 flex font-sans text-slate-800">

    <SecreteriaSidebar @logout="handleLogout" />

    <div class="flex-1 flex flex-col ml-40">
      <!-- Navbar reutilizado — tag SECRETARÍA centrado -->
      <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Secretaría</span>

        <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div class="w-10 h-8 flex items-center justify-center">
            <img src="/logo-uniautonoma.png" alt="Uniatónoma del Cauca" class="w-full h-full object-contain" />
          </div>
          <span class="logo font-bold text-[15px] text-slate-800 tracking-tight">Novedades Autonoma</span>
        </div>

        <div ref="notificationsRoot" class="relative flex items-center gap-3">
          <button
            class="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            type="button"
            @click="toggleNotificaciones"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="w-[17px] h-[17px] text-slate-500">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>

            <span
              v-if="unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-[18px] text-center"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>

          <div
            v-if="isOpen"
            class="absolute top-11 right-0 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-700">Notificaciones de solicitudes</h3>
              <button
                v-if="notificaciones.length > 0"
                type="button"
                class="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                @click="marcarTodas"
              >
                Marcar todas
              </button>
            </div>

            <div v-if="isLoading" class="px-4 py-8 text-sm text-slate-500 text-center">
              Cargando notificaciones...
            </div>

            <div v-else-if="errorMessage" class="px-4 py-6 text-sm text-red-500 text-center">
              {{ errorMessage }}
            </div>

            <ul v-else-if="notificaciones.length > 0" class="max-h-80 overflow-y-auto divide-y divide-slate-100">
              <li v-for="item in notificaciones" :key="item.id" class="px-4 py-3 hover:bg-slate-50 transition-colors">
                <button type="button" class="w-full text-left" @click="abrirNotificacion(item)">
                  <p class="text-sm font-semibold text-slate-700">{{ item.titulo }}</p>
                  <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ item.mensaje }}</p>
                  <p class="text-[11px] text-slate-400 mt-1.5">{{ formatDate(item.created_at) }}</p>
                </button>
              </li>
            </ul>

            <div v-else class="px-4 py-8 text-sm text-slate-500 text-center">
              No tienes notificaciones nuevas.
            </div>
          </div>

          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer select-none">
            {{ initial }}
          </div>
        </div>
      </header>

      <main class="flex-1 px-8 py-7">
        <slot />
      </main>

      <footer class="px-8 py-4 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-400">
        <span>© 2026 Novedades Autonoma – Gestión Académica Universitaria</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-slate-600 transition-colors">Soporte Técnico</a>
          <a href="#" class="hover:text-slate-600 transition-colors">Privacidad</a>
        </div>
      </footer>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import notificacionesService from '../../services/notificacionesService'
import type { Notificacion } from '../../types'
import SecreteriaSidebar from '../secretaria/SecreteriaSideabar.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationsRoot = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const notificaciones = ref<Notificacion[]>([])
const unreadCount = ref(0)
const refreshTimer = ref<ReturnType<typeof setInterval> | null>(null)

const initial = computed(() => authStore.student?.nombre?.charAt(0).toUpperCase() ?? 'S')

function formatDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function filtrarSolicitudes(items: Notificacion[]): Notificacion[] {
  return items.filter((item) => {
    const tipo = String(item.tipo_notificacion || '').toLowerCase()
    return Boolean(item.solicitud_id) || tipo.includes('solicitud') || tipo.includes('cambio_estado')
  })
}

async function cargarResumen(): Promise<void> {
  try {
    const estadisticas = await notificacionesService.obtenerEstadisticasNoLeidas()
    unreadCount.value = estadisticas.total
  } catch (error) {
    console.warn('⚠️ No se pudo cargar el contador de notificaciones de secretaría:', error)
    unreadCount.value = 0
  }
}

async function cargarNoLeidas(): Promise<void> {
  isLoading.value = true
  errorMessage.value = null

  try {
    const lista = await notificacionesService.obtenerNoLeidas(20)
    notificaciones.value = filtrarSolicitudes(lista)
    unreadCount.value = notificaciones.value.length
  } catch (error: any) {
    console.error('❌ Error cargando notificaciones de secretaría:', error)
    errorMessage.value = error?.message || 'No fue posible cargar las notificaciones.'
  } finally {
    isLoading.value = false
  }
}

async function toggleNotificaciones(): Promise<void> {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    await cargarNoLeidas()
  }
}

async function abrirNotificacion(item: Notificacion): Promise<void> {
  try {
    await notificacionesService.marcarComoLeida(item.id)
    notificaciones.value = notificaciones.value.filter((current) => current.id !== item.id)
    unreadCount.value = Math.max(0, unreadCount.value - 1)

    if (item.solicitud_id) {
      isOpen.value = false
      router.push({ name: 'SecretariaDetalle', params: { id: item.solicitud_id } })
    }
  } catch (error) {
    console.error('❌ Error marcando notificación de secretaría como leída:', error)
  }
}

async function marcarTodas(): Promise<void> {
  try {
    await notificacionesService.marcarTodasComoLeidas()
    notificaciones.value = []
    unreadCount.value = 0
  } catch (error) {
    console.error('❌ Error marcando todas las notificaciones de secretaría como leídas:', error)
  }
}

function handleClickOutside(event: MouseEvent): void {
  if (!isOpen.value) return
  const target = event.target as Node
  if (notificationsRoot.value && !notificationsRoot.value.contains(target)) {
    isOpen.value = false
  }
}

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}

onMounted(async () => {
  await cargarResumen()
  document.addEventListener('click', handleClickOutside)
  refreshTimer.value = setInterval(cargarResumen, 60000)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
})
</script>

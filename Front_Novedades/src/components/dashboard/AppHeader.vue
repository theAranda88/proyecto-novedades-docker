<template>
  <div class="h-full px-6 flex items-center">

    <!-- Título -->
    <span class="text-sm font-semibold text-slate-500 basis-1/3">
      Estudiante
    </span>

    <!-- Logo centrado -->
    <div class="flex items-center gap-2 basis-1/3 justify-center">
      <div class="w-10 h-8 flex items-center justify-center shrink-0">
        <img src="/logo-uniautonoma.png" alt="Uniatónoma del Cauca" class="w-full h-full object-contain" />
      </div>
      <span class="logo text-lg font-bold text-blue-600 tracking-tight">Novedades Autonoma</span>
    </div>

    <!-- Acciones -->
    <div ref="notificationsRoot" class="relative flex items-center gap-3 basis-1/3 justify-end">

      <!-- Notificaciones -->
      <button
        class="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
        type="button"
        @click="toggleNotificaciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
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
        class="absolute top-12 right-0 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
      >
        <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-700">Notificaciones</h3>
          <button
            v-if="notificaciones.length > 0"
            type="button"
            class="text-xs font-medium text-blue-600 hover:text-blue-700"
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
            <button type="button" class="w-full text-left" @click="marcarComoLeida(item.id)">
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

      <!-- Avatar con inicial del nombre -->
      <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold select-none">
        {{ initial }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '../../store/authStore'
import notificacionesService from '../../services/notificacionesService'
import type { Notificacion } from '../../types'

const authStore = useAuthStore()
const notificationsRoot = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const notificaciones = ref<Notificacion[]>([])
const unreadCount = ref(0)

// Toma la primera letra del nombre del estudiante autenticado
const initial = computed(
  () => authStore.student?.nombre?.charAt(0).toUpperCase() ?? 'E'
)

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

async function cargarResumen(): Promise<void> {
  try {
    const estadisticas = await notificacionesService.obtenerEstadisticasNoLeidas()
    unreadCount.value = estadisticas.total
  } catch (error) {
    console.warn('⚠️ No se pudo cargar el contador de notificaciones:', error)
    unreadCount.value = 0
  }
}

async function cargarNoLeidas(): Promise<void> {
  isLoading.value = true
  errorMessage.value = null

  try {
    const lista = await notificacionesService.obtenerNoLeidas(20)
    notificaciones.value = lista
    unreadCount.value = lista.length
  } catch (error: any) {
    console.error('❌ Error cargando notificaciones:', error)
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

async function marcarComoLeida(id: number): Promise<void> {
  try {
    await notificacionesService.marcarComoLeida(id)
    notificaciones.value = notificaciones.value.filter((item) => item.id !== id)
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  } catch (error) {
    console.error('❌ Error marcando notificación como leída:', error)
  }
}

async function marcarTodas(): Promise<void> {
  try {
    await notificacionesService.marcarTodasComoLeidas()
    notificaciones.value = []
    unreadCount.value = 0
  } catch (error) {
    console.error('❌ Error marcando todas como leídas:', error)
  }
}

function handleClickOutside(event: MouseEvent): void {
  if (!isOpen.value) return
  const target = event.target as Node
  if (notificationsRoot.value && !notificationsRoot.value.contains(target)) {
    isOpen.value = false
  }
}

onMounted(async () => {
  await cargarResumen()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="min-h-dvh bg-slate-50 flex flex-col font-sans text-slate-800 md:flex-row">

    <AdminSidebar @logout="handleLogout" />

    <div class="flex min-w-0 flex-1 flex-col md:ml-52">

      <!-- Topbar Admin — breadcrumb + acciones -->
      <header class="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 text-[12.5px] text-slate-400 mr-2">
          <span class="text-slate-600 font-medium">Administración</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="text-slate-700 font-semibold">{{ paginaActual }}</span>
        </nav>

        <!-- Avatar -->
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer select-none">
          {{ authStore.student?.nombre?.charAt(0).toUpperCase() || "A" }}
        </div>
      </header>

      <main class="entrada-suave mx-auto w-full max-w-[90rem] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <slot />
      </main>

      <footer class="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-600 sm:px-6">
        Novedades Autónoma · Gestión académica
      </footer>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import AdminSidebar from '../admin/AdminSidebar.vue'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const paginaActual = computed(() => {
  const map: Record<string, string> = {
    AdminDashboard: 'Solicitudes',
    AdminSolicitudDetalle: 'Detalle de solicitud',
    AdminUsuarios:  'Gestión de usuarios',
    AdminAuditoria: 'Auditoría',
  }
  return map[route.name as string] ?? 'Admin'
})

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

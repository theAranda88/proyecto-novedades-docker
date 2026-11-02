<template>
  <div class="min-h-screen bg-slate-50 flex font-sans text-slate-800">
    <DashboardSidebar @logout="handleLogout" />

    <div class="flex-1 flex flex-col ml-40">
      <AppNavbar :initials="student?.nombre?.charAt(0) || 'U'" />

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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { storeToRefs } from 'pinia'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.vue'
import AppNavbar from '../layout/AppNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const { student } = storeToRefs(authStore)

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
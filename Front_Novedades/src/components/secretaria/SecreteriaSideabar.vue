<template>
  <aside class="w-40 min-h-screen bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 z-20">

    <!-- Brand tag -->
    <div class="px-4 py-4 border-b border-slate-100 flex items-center gap-2">
      <div class="w-10 h-8 shrink-0 flex items-center justify-center">
        <img src="/logo-uniautonoma.png" alt="Uniatónoma del Cauca" class="w-full h-full object-contain" />
      </div>
      <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Secretaría</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 py-4 flex flex-col gap-0.5 px-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        custom
        v-slot="{ isActive, navigate }"
      >
        <button
          @click="navigate"
          :class="[
            'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all w-full text-left',
            isActive
              ? 'bg-indigo-50 text-indigo-700 font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          ]"
        >
          <!-- Dashboard icon (home) -->
          <svg
            v-if="item.iconKey === 'home'"
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>

          <!-- Solicitudes icon (history) -->
          <svg
            v-else-if="item.iconKey === 'history'"
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>

          <!-- Config icon (shield) -->
          <svg
            v-else-if="item.iconKey === 'shield'"
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>

          <span>{{ item.label }}</span>
          <svg
            v-if="isActive"
            class="ml-auto w-3.5 h-3.5 text-indigo-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </RouterLink>
    </nav>

    <!-- Cerrar sesión -->
    <div class="px-2 py-4 border-t border-slate-100">
      <button
        @click="$emit('logout')"
        class="flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all w-full font-medium"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar Sesión
      </button>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { NavItem } from '../../types'

defineEmits<{ logout: [] }>()

const navItems: NavItem[] = [
  { label: 'Dashboard',             routeName: 'SecretariaSolicitudes', iconKey: 'home'    },
  { label: 'Gestionar Solicitudes', routeName: 'SecretariaSolicitudes', iconKey: 'history' },
]
</script>

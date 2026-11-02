<template>
  <div class="flex flex-col h-full">

    <!-- Items de navegación -->
    <nav class="flex-1 px-3 py-7">
      <ul class="flex flex-col gap-1">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="
              $route.name === item.routeName
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            "
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Cerrar sesión -->
    <div class="p-3 border-t border-slate-100">
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500
               hover:bg-red-50 hover:text-red-700 transition-colors"
        @click="$emit('logout')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Cerrar Sesión
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const $route = useRoute()
defineEmits<{ (e: 'logout'): void }>()

// Helper para crear íconos SVG sin importar librerías externas
const makeIcon = (d: string) =>
  defineComponent(() => () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d }),
    ])
  )

const navItems = [
  {
    name: 'Inicio',
    to: '/dashboard',
    routeName: 'Dashboard',
    icon: makeIcon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'),
  },
  {
    name: 'Nueva Solicitud',
    to: '/nueva-solicitud',
    routeName: 'Nueva Solicitud',
    icon: makeIcon('M12 4v16m8-8H4'),
  },
  {
    name: 'Mi Historial',
    to: '/historial',
    routeName: 'Historial',
    icon: makeIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
  },
  {
    name: 'Mi Perfil',
    to: '/perfil',
    routeName: 'Perfil',
    icon: makeIcon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'),
  },
];
</script>
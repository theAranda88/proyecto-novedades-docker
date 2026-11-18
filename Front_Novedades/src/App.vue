<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AsistenteNovedades from './components/dashboard/AsistenteNovedades.vue'
import { useAuthStore } from './store/authStore'

const route = useRoute()
const auth = useAuthStore()
</script>

<template>
  <!-- RouterView renderiza la página activa según la ruta.
   Cada página define su propio layout internamente. -->
  <RouterView />
  <AsistenteNovedades
    v-if="route.meta.requiredRole === 'Estudiante' && auth.isAuthenticated && auth.student?.rol === 'Estudiante'"
    :key="auth.token"
  />
</template>

<template>
    <AuthLayout
        title="Inicia sesión"
        subtitle="Ingresa con tu cuenta institucional para continuar."
        descripcion="En Novedades Autónoma puedes solicitar cambios de curso o jornada, adicionar materias y pedir un curso dirigido. Consulta aquí el estado de tus solicitudes. Secretaría y administración usan este mismo portal para gestionarlas."
    >
    <AlertMessage :message="authStore.error" class="mb-5"/>

    <LoginForm :loading="authStore.isLoading" @submit="handleLogin"/>

    <div v-if="googleHabilitado" class="mt-5">
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-2 text-slate-400">o continúa con</span>
        </div>
      </div>
      <Cargando v-if="cargandoGoogle" texto="Preparando acceso con Google…" />
      <p v-else-if="errorGoogle" class="text-center text-sm text-slate-600">El acceso con Google no está disponible en este momento.</p>
      <div id="google-login-button" class="flex justify-center"></div>
    </div>

    <template #footer-extra>
      <p class="text-xs text-slate-500 mt-1">
        ¿Problemas para ingresar?
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=yudith.agredo.r@uniautonoma.edu.co,luis.ramos.sanjuan@uniautonoma.edu.co,cristian.aranda.h@uniautonoma.edu.co"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline font-medium"
        >
          Contactar Soporte
        </a>
      </p>
    </template>

    </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '../components/layout/AuthLayout.vue';
import LoginForm from '../components/auth/LoginForm.vue';
import AlertMessage from '../components/ui/AlertMessage.vue';
import { useAuthStore } from '../store/authStore';
import type { LoginPayload } from '../types';

const router = useRouter();
const authStore = useAuthStore();

declare global {
  interface Window {
    google?: any
  }
}

const googleHabilitado = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
const cargandoGoogle = ref(googleHabilitado);
const errorGoogle = ref(false);
let esperaGoogle: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  authStore.clearError();
  if (googleHabilitado) cargarGoogle(0);
});

onUnmounted(() => clearTimeout(esperaGoogle));

function cargarGoogle(intentos: number) {
  if (window.google?.accounts?.id) {
    try {
      renderGoogleButton();
    } catch {
      errorGoogle.value = true;
    }
    cargandoGoogle.value = false;
  } else if (intentos < 25) {
    esperaGoogle = setTimeout(() => cargarGoogle(intentos + 1), 200);
  } else {
    errorGoogle.value = true;
    cargandoGoogle.value = false;
  }
}
function renderGoogleButton() {
  const button = document.getElementById('google-login-button');
  if (!button || !window.google?.accounts?.id) return;

  button.innerHTML = '';


  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    hd: import.meta.env.VITE_GOOGLE_HD || 'uniautonoma.edu.co',
    callback: async (response: { credential: string }) => {
      try {
        const { requiresPasswordChange } = await authStore.loginWithGoogle(response.credential);
        await redirectAfterLogin(requiresPasswordChange);
      } catch (err) {
        console.error('❌ Login con Google falló:', err);
      }
    },
  });

  window.google.accounts.id.renderButton(button, {
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    locale: 'es',
  });
}

async function handleLogin(payload: LoginPayload) {
    try {
        const { requiresPasswordChange } = await authStore.login(payload);
        await redirectAfterLogin(requiresPasswordChange);
    } catch (err) {
        console.error('❌ LoginPage.handleLogin catch:', err)
    }
}

async function redirectAfterLogin(requiresPasswordChange: boolean) {
  if (requiresPasswordChange) {
      await router.push({ name: 'ChangePassword' });
      return;
  }

  const rol = authStore.student?.rol
  if (rol === 'Administrador') {
      await router.push({ name: 'AdminUsuarios' })
  } else if (rol === 'Secretaria') {
      await router.push({ name: 'SecretariaDashboard' })
  } else {
      await router.push({ name: 'Dashboard' })
  }
}

</script>

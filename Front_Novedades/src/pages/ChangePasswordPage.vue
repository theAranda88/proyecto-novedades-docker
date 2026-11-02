<template>
    <AuthLayout
        title="Cambio de Contraseña"
        subtitle="Se te ha asignado una contraseña temporal. Debes crear una nueva para continuar."
    >

    <!-- Icono personalizado -->
        <template #icon>
            <div class="relative w-16 h-16">
                <div class="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-indigo-300/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>

            <!-- Badge -->
            <span class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </span>

            </div>
        </template>

        <!-- Aviso informativo -->
         <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-amber-700">
                Por seguridad, no podras acceder al portal hasta completar este paso.
            </p>
         </div>

         <div class="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {{
                                        (authStore.student?.nombre || authStore.mockStudent.nombre)
                    .split(' ')
                    .map(n => n[0])
                    .slice(0,2)
                    .join('')
                    .toUpperCase()
                }}
            </div>
          <div class="min-w-0">
                        <p class="text-[13px] font-semibold text-slate-700 truncate">{{ authStore.student?.nombre || authStore.mockStudent.nombre }}</p>
                        <p class="text-[11px] text-slate-400">Código: {{ authStore.student?.codigo || authStore.mockStudent.codigo }}</p>
          </div>
          <span class="ml-auto text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg whitespace-nowrap">Primer acceso</span>
        </div>


         <!-- Error de API -->
          <AlertMessage :message="authStore.error" class="mb-5"/>

          <!-- Formulario de cambio -->
           <ChangePasswordForm :loading="authStore.isLoading" @submit="handleChangePassword"/>
    </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '../components/layout/AuthLayout.vue';
import ChangePasswordForm from '../components/auth/ChangePasswordForm.vue';
import AlertMessage from '../components/ui/AlertMessage.vue';
import { useAuthStore } from '../store/authStore';
import type { ChangePasswordPayload } from '../types';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => authStore.clearError());

/* Llama al store para camniar la contraseña.
    Si tiene exito, rederige al dashboard
 */

 async function handleChangePassword(payload: ChangePasswordPayload) {
    try {
        await authStore.changePassword(payload);
        // Cambio exitoso -> ir al home según rol
        const rol = authStore.student?.rol
        if (rol === 'Administrador') {
            await router.push({ name: 'AdminUsuarios' })
        } else if (rol === 'Secretaria') {
            await router.push({ name: 'SecretariaDashboard' })
        } else {
            await router.push({ name: 'Dashboard' })
        }
    } catch {
        // El error se muestra en AlertMessage via authStore.error
    }
 }

</script>
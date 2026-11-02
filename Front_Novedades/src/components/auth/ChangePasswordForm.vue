<template>
    <form class="flex flex-col gap-5" @submit.prevent="handleSubmit" novalidate>
        <!-- Contraseña actual -->
        <BaseInput
            v-model="form.currentPassword"
            label="Contraseña Actual"
            type="password"
            placeholder="Ingresa tu contraseña temporal"
            :error-message="errors.currentPassword"
            autocomplete="current-password"
            @blur="validateField('currentPassword')"
        >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </template>
        </BaseInput>

        <!-- Nueva contra -->
         <div>
            <BaseInput
                v-model="form.newPassword"
                label="Nueva Contraseña"
                type="password"
                placeholder="Minimo 8 caracteres"
                :error-message="errors.newPassword"
                autocomplete="new-password"
                @input="updateStrenght"
                @blur="validateField('newPassword')"
            >
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </template>
            </BaseInput>

            <!-- Indicador de fortaleza de contraseña -->
             <div v-if="form.newPassword" class="mt-2 flex gap-1">
                <div
                    v-for="i in 4"
                    :key="i"
                    class="h-1.5 flex-1 rounded-full transition-colors duration-300"
                    :class="i <= strenght.level ? strenght.color : 'bg-slate-200'"
                />
             </div>
             <p v-if="form.newPassword && strenght.label" class="mt-1 text-xs" :class="strenght.textColor">
                Contraseña {{ strenght.label }}
             </p>
         </div>

         <!-- Requisitos -->
          <ul class="grid grid-cols-2 gap-1.5 text-xs">
            <li v-for="req in requeriments" :key="req.label" class="flex items-center gap-1.5">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3.5 h-3.5 shrink-0"
                    :class="req.met ? 'text-green-500' : 'text-slate-300'"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span :class="req.met ? 'text-slate-700' : 'text-slate-400'">{{ req.label }}</span>
            </li>
          </ul>

          <!-- Confirmar Contraseña -->
        <BaseInput
          v-model="form.confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          placeholder="Repite la nueva contraseña"
          :error-message="errors.confirmPassword"
          autocomplete="new-password"
          @blur="validateField('confirmPassword')"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </template>
        </BaseInput>

        <!-- Boton submit -->
         <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            class="w-full mt-1"
         >
            Establecer Nueva Contraseña
        </BaseButton>
    </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';
import { validateNewPassword, validatePasswordMatch, validatePassword } from '../../utils/validators';
import type { ChangePasswordPayload } from '../../types';

defineProps<{ loading: boolean }>();

const emit = defineEmits<{
    (e: 'submit', payload: ChangePasswordPayload): void;
}>();

const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });
const errors = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });

// Indicador de fortaleza
const requeriments = computed(() => [
    { label: 'Minimo 8 caracteres', met: form.newPassword.length >= 8 },
    { label: 'Una mayuscula', met: /[A-Z]/.test(form.newPassword) },
    { label: 'Un numero', met: /[0-9]/.test(form.newPassword) },
    { label: 'Sin espacios', met: !/\s/.test(form.newPassword) && form.newPassword.length > 0 },
]);

const strenght = computed(() => {
    const met = requeriments.value.filter(r => r.met).length;

    if (met <= 1) return { level: 1, color: 'bg-red-400', textColor: 'text-red-500', label: 'muy débil' };
    if (met === 2) return { level: 2, color: 'bg-orange-400', textColor: 'text-orange-500', label: 'débil' };
    if (met === 3) return { level: 3, color: 'bg-yellow-400', textColor: 'text-yellow-600', label: 'regular' };

    return { level: 4, color: 'bg-green-500', textColor: 'text-green-600', label: 'fuerte' }
});

function updateStrenght() {
    if (errors.newPassword) validateField('newPassword');
}

function validateField(field: 'currentPassword' | 'newPassword' | 'confirmPassword') {
    if (field === 'currentPassword') {
        errors.currentPassword = validatePassword(form.currentPassword) ?? '';
    }

    if (field === 'newPassword') {
        errors.newPassword = validateNewPassword(form.newPassword) ?? '';
    }

    if (field === 'confirmPassword') {
        errors.confirmPassword = validatePasswordMatch(form.newPassword, form.confirmPassword) ?? '';
    }
}

function handleSubmit() {
    validateField('currentPassword');
    validateField('newPassword');
    validateField('confirmPassword');
    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) return
        emit('submit', {
            password_actual: form.currentPassword,
            password_nueva: form.newPassword,
            password_confirmacion: form.confirmPassword,
        });
}

</script>
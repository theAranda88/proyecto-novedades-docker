<template>
    <form class="flex flex-col gap-5" @submit.prevent="handleSubmit" novalidate>
        <BaseInput
            v-model="form.correo"
            label="Correo institucional"
            type="email"
            placeholder="usuario@uniautonoma.edu.co"
            :error-message="errors.correo"
            hint="Usa tu correo institucional de la universidad."
            autocomplete="username"
            @blur="validateField('correo')"
         >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </template>
        </BaseInput>

        <BaseInput
            v-model="form.password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            :error-message="errors.password"
            autocomplete="current-password"
            @blur="validateField('password')"
         >
         <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
         </template>
        </BaseInput>

        <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            class="w-full mt-1"
        >
            Ingresar al Portal
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </BaseButton>
    </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';
import { validateEmail, validatePassword } from '../../utils/validators';
import type { LoginPayload } from '../../types';

const props = defineProps<{ loading: boolean }>();

const emit = defineEmits<{
    (e: 'submit', payload: LoginPayload): void;
}>();

const form = reactive<LoginPayload>({
    correo: '',
    password: ''
});

const errors = reactive ({
    correo: '',
    password: ''
});

function validateField(field: keyof typeof errors) {
    if (field === 'correo') {
        errors.correo = validateEmail(form.correo) ?? '';
    }
    if (field === 'password') {
        errors.password = validatePassword(form.password) ?? '';
    }
}

function validateAll(): boolean {
    validateField('correo');
    validateField('password');
    return !errors.correo && !errors.password;
}

function handleSubmit() {
    if (!validateAll()) return;
    emit('submit', { ...form });
}
</script>
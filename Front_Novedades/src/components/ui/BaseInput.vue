<template>
    <div class="flex flex-col gap-1.5">
        <!-- Label con enlace opcional (Ej: "¿Olvido su contraseña?") -->
         <div class="flex items-center justify-between">
            <label
                v-if="label" 
                :for="inputId"
                class="text-sm font-medium text-slate-700"
            >
                {{ label }}
            </label>
            <slot name="label-right"/>
         </div>

         <!-- Contenedor del input con icono -->
          <div class="relative">
            <span
                v-if="$slots.icon"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            >
                <slot name="icon"/>
            </span>

            <input
                :id="inputId"
                v-bind="$attrs"
                :type="inputType"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="[
                    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800',
                    'transition-all duration-150 outline-none',
                    'placeholder:text-slate-400',
                    $slots.icon ? 'pl-9' : '',
                    showPasswordToggle ? 'pr-10' : '',
                    hasError
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                    disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : '',
                ]"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @blur="$emit('blur')" 
            />

            <!-- Toggle mostrar/ocultar contraseña -->
            <button
                v-if="showPasswordToggle"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                @click="togglePasswordVisibility"
                :aria-label="isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
             >
                <!-- Ojo abierto -->
                <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Ojo cerrado -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
            </button>
          </div>

          <!-- Mensaje de error o ayuda -->
           <p v-if="hasError" class="text-xs text-red-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ errorMessage }}
           </p>
           <p v-else-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Heredar atributos en el input, no en el div contenedor
defineOptions({ inheritAttrs: false });

const props = withDefaults (
    defineProps<{
        modelValue?: string;
        label?: string;
        placeholder?: string;
        type?: string;
        errorMessage?: string;
        hint?: string;
        disabled?: boolean;
    }>(),
    {
        type: 'text',
        disabled: false
    }
);

defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'blur'): void;
}>();

// ID unico para accesibilidad (aria)
const inputId = `input-${Math.random().toString(36).slice(2, 7)}`;

// Contro para visibilidad de contraseña
const isPasswordVisible = ref(false);
const showPasswordToggle = computed(() => props.type === 'password');
const inputType = computed(() => {
    if (props.type === 'password') {
        return isPasswordVisible.value ? 'text' : 'password';
    }

    return props.type;
});

function togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
}

const hasError = computed(() => !!props.errorMessage);

</script>
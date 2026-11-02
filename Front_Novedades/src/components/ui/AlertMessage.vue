<template>
<Transition>
    <div
        v-if="message"
        role="alert"
        :class="[
            'flex items-start gap-3 rounded-lg px-4 py-3 text-sm',
            typeClasses
        ]"
    >
        <!-- Icono segun tipo -->
        <svg
            v-if="type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <svg
            v-else-if="type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>

        <span>{{ message }}</span>
    </div>
</Transition>    
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults (
    defineProps<{
        message?: string | null;
        type?: 'error' | 'success' | 'info';
    }>(),
    { type: 'error' }
);

const typeClasses = computed(() => ({
    error: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200'
}[props.type]));

</script>

<style scoped>
.alert-fade-enter-active,
.alert-fade-enter-active {
    transition: all 0.25s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

</style>
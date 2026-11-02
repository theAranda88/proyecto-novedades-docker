<template>
    <button
        v-bind="$attrs"
        :type="type"
        :disabled="disabled || loading"
        :class="[
            'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
            'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            sizeClasses,
            variantClasses
        ]"
    >

    <!-- Spinner de carga -->
     <svg
        v-if="loading"
        class="animate-ping w-4 h-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
     >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
     </svg>

     <slot/>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults (
    defineProps<{
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
        size?: 'sm' | 'md' | 'lg';
        loading?: boolean,
        disabled?: boolean,
        type?: 'button' | 'submit' | 'reset';
    }>(),
    {
        variant: 'primary',
        size: 'md',
        loading: false,
        disabled: false,
        type: 'button'
    }
);

const sizeClasses = computed(() => ({
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'     
}[props.size]));

const variantClasses = computed(() => ({
    primary: 'bg-[var(--color-orange)] text-white hover:bg-[var(--color-orange-dark)] focus:ring-[var(--color-orange)] active:bg-[var(--color-orange-dark)]',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400 border border-slate-300',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
}[props.variant]));

</script>
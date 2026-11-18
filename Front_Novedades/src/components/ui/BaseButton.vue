<template>
    <button
        v-bind="$attrs"
        :type="type"
        :disabled="disabled || loading"
        :aria-busy="loading || undefined"
        :class="[
            'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
            'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            sizeClasses,
            variantClasses
        ]"
    >

    <Cargando v-if="loading" decorativo />

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
    primary: 'bg-[var(--color-orange)] text-[#172f48] hover:bg-[#f6be86] focus:ring-[var(--color-orange)] active:bg-[#f6be86]',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400 border border-slate-300',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
}[props.variant]));

</script>

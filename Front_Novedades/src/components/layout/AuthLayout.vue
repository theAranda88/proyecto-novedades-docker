<template>
    <div class="min-h-screen bg-slate-50 flex flex-col">
        <!-- Header con logo -->
        <header class="w-full py-4 px-6 bg-white border-b border-slate-200 flex items-center justify-center">
            <div class="flex items-center gap-2">
                <div class="w-10 h-8 flex items-center justify-center">
                    <img src="/logo-uniautonoma.png" alt="Uniatónoma del Cauca" class="w-full h-full object-contain" />
                </div>
                <span class="logo text-lg font-bold text-blue-600 tracking-tight">Novedades Autonoma</span>
            </div>
        </header>

        <!-- Contenido principal centrado -->
        <main class="flex-1 flex items-center justify-center px-4 py-12">
            <div class="w-full max-w-md">
                <!-- Tarjeta del formulario -->
                <div class="bg-white border border-slate-200 rounded-t-md shadow p-8 pb-5">
                    <!-- Cabecera con icono -->
                    <div class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            <slot name="icon">
                                <!-- Icono por defecto -->
                                <div class="w-28 h-20 flex items-center justify-center">
                                    <img
                                        src="/logo-uniautonoma.png"
                                        alt="Uniatónoma del Cauca"
                                        class="w-full h-full object-contain"
                                    />
                                </div>
                            </slot>
                        </div>
                        <h1 class="text-xl font-bold text-slate-800">{{ title }}</h1>
                        <p class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
                    </div>

                    <!-- Slot para el contenido del formulario -->
                    <slot />
                </div>

                <!-- Footer de seguridad -->
                <div
                    v-if="$slots['footer-extra']"
                    class="border bg-white border-t-0 border-slate-200 rounded-b-md shadow-sm px-5 py-4 text-center flex flex-col items-center gap-2"
                >
                    <slot name="footer-extra" />
                </div>

                <div class="flex items-center justify-center mt-6 gap-1.5 text-xs text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>CONEXIÓN SEGURA · SSL INSTITUCIONAL</span>
                </div>
            </div>
        </main>

        <!-- Footer global -->
        <footer
            class="py-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>© 2025 Novedades Autonoma · Gestión Académica Universitaria</span>
            <div class="flex gap-4">
                <a href="#" class="hover:text-slate-600 transition-colors">Soporte Técnico</a>
                <a href="#" class="hover:text-slate-600 transition-colors">Privacidad</a>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string,
    subtitle?: string
}>();
</script>
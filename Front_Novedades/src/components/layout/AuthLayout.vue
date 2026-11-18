<template>
  <div class="flex min-h-dvh flex-col bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 sm:px-8"
        :class="descripcion ? 'min-h-16 justify-center text-center' : ''"
      >
        <img v-if="!descripcion" src="/logo-uniautonoma.png" alt="" class="h-8 w-12 object-contain" />
        <span
          class="logo leading-tight text-blue-600"
          :class="descripcion ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'"
        >Novedades Autónoma</span>
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-14">
      <div
        class="entrada-suave grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
        :class="descripcion ? 'max-w-5xl lg:grid-cols-[1.1fr_1fr]' : 'max-w-md'"
      >
        <section v-if="descripcion" aria-label="Acerca del portal" class="banda-institucional flex flex-col items-center justify-center p-6 text-center text-white sm:p-10 lg:min-h-[36rem] lg:p-12">
          <div class="relative flex max-w-md flex-col items-center">
            <img
              src="/logo-uniautonoma.png"
              alt="Corporación Universitaria Autónoma del Cauca"
              class="mb-5 size-24 rounded-2xl bg-white p-1 object-contain shadow-lg ring-1 ring-white/20 sm:mb-6 sm:size-28"
              width="240"
              height="240"
            />
            <p class="mb-3 text-xs font-bold tracking-widest text-[#f6be86] uppercase">Gestión académica</p>
            <p class="font-brand text-2xl leading-tight text-balance sm:text-4xl">Tus trámites académicos en un solo lugar</p>
            <p class="mt-4 text-sm leading-relaxed text-blue-100 sm:text-base">{{ descripcion }}</p>
          </div>
        </section>

        <section class="min-w-0 px-5 py-7 sm:px-10 sm:py-10 lg:p-12">
          <div class="mb-7">
            <slot name="icon" />
            <h1 class="font-brand text-2xl leading-tight sm:text-3xl">{{ title }}</h1>
            <p v-if="subtitle" class="mt-2 text-sm leading-relaxed text-slate-600">{{ subtitle }}</p>
          </div>
          <slot />
          <div v-if="$slots['footer-extra']" class="mt-6 border-t border-slate-200 pt-4">
            <slot name="footer-extra" />
          </div>
        </section>
      </div>
    </main>

    <footer class="px-5 py-5 text-center text-xs text-slate-600">
      Corporación Universitaria Autónoma del Cauca
    </footer>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; descripcion?: string }>()
</script>

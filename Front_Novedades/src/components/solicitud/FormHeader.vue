<template>
  <header class="banda-institucional rounded-2xl px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
    <div class="relative max-w-2xl">
      <RouterLink :to="{ name: 'Dashboard' }" class="mb-4 inline-block text-sm font-semibold text-blue-100 hover:underline">
        <span aria-hidden="true">‹</span> Inicio
      </RouterLink>
      <h1 class="font-brand text-2xl text-white! sm:text-3xl">Nueva solicitud académica</h1>
      <p class="mt-3 text-sm leading-relaxed text-blue-100">
        Selecciona el trámite, revisa los datos de tu horario y explica tu solicitud. Adjunta los soportes que correspondan.
      </p>
    </div>
  </header>
</template>

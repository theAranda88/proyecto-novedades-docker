<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

    <div class="p-5 flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl">
      <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-800">Tiempos de Respuesta</p>
        <p class="text-sm text-slate-500 mt-1 leading-relaxed">
          La solicitud puede tardar hasta
          <span class="font-semibold text-slate-700">5 días hábiles</span>.
        </p>
      </div>
    </div>

    <div class="p-5 flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl">
      <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-800">Documentación Requerida</p>
        <p class="text-sm text-slate-500 mt-1 leading-relaxed">
          Ten listo tu
          <span class="font-semibold text-slate-700">recibo de pago</span> y
          <span class="font-semibold text-slate-700">carnét vigente</span>.
        </p>
      </div>
    </div>

  </div>
</template>
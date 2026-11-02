<template>
  <div class="flex flex-col h-screen overflow-hidden bg-slate-50">

    <!-- Slot del header -->
    <header class="shrink-0 h-16 bg-white border-b border-slate-200 z-50">
      <slot name="header" />
    </header>

    <!-- Cuerpo: sidebar + contenido -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Slot del sidebar -->
      <aside class="shrink-0 w-56 bg-white border-r border-slate-200 flex flex-col">
        <slot name="sidebar" />
      </aside>

      <!-- Slot del contenido — aquí vive el scroll -->
      <main class="flex-1 overflow-y-auto p-7">
        <slot />
      </main>

    </div>
  </div>
</template>
<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-[#f5f7fb]">
    <header class="z-50 h-16 shrink-0 border-b border-slate-200 bg-white">
      <slot name="header" />
    </header>

    <div class="flex min-h-0 flex-1 flex-col md:flex-row">
      <aside class="shrink-0 border-b border-slate-200 bg-white md:w-52 md:border-r md:border-b-0 xl:w-56">
        <slot name="sidebar" />
      </aside>

      <main class="entrada-suave min-w-0 flex-1 overflow-y-auto px-4 pt-5 pb-24 sm:px-6 md:px-8 lg:pt-8 xl:px-10">
        <slot />
      </main>
    </div>
  </div>
</template>

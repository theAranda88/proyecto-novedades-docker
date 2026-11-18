<template>
  <section aria-labelledby="solicitudes-recientes" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <header class="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-5 sm:px-6">
      <h2 id="solicitudes-recientes" class="text-lg font-bold">Solicitudes recientes</h2>
      <RouterLink :to="{ name: 'History' }" class="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
        Ver historial <span aria-hidden="true">→</span>
      </RouterLink>
    </header>

    <Cargando v-if="cargando" texto="Cargando tus solicitudes…" />
    <p v-else-if="error" role="status" class="border-t border-slate-200 px-4 py-6 text-sm text-slate-500 sm:px-6">
      No se pudieron cargar tus solicitudes. Intenta de nuevo más tarde.
    </p>
    <p v-else-if="!solicitudes.length" class="border-t border-slate-200 px-4 py-6 text-sm text-slate-500 sm:px-6">
      Tus solicitudes aparecerán aquí después de enviarlas.
    </p>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-sm" aria-labelledby="solicitudes-recientes">
        <thead class="border-y border-slate-200 bg-[#f5f7fb] text-slate-600">
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold sm:px-6">Código</th>
            <th scope="col" class="px-4 py-3 font-semibold">Tipo de trámite</th>
            <th scope="col" class="px-4 py-3 font-semibold whitespace-nowrap">Fecha de envío</th>
            <th scope="col" class="px-4 py-3 font-semibold sm:px-6">Estado</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="solicitud in solicitudes" :key="solicitud.id" class="hover:bg-[#f5f7fb]">
            <th scope="row" class="px-4 py-3.5 font-semibold whitespace-nowrap text-blue-600 sm:px-6">{{ solicitud.id }}</th>
            <td class="px-4 py-3.5">{{ solicitud.tipo }}</td>
            <td class="px-4 py-3.5 whitespace-nowrap text-slate-500">{{ solicitud.fechaEnvio }}</td>
            <td class="px-4 py-3.5 sm:px-6">
              <span class="inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap" :class="estadoBadge[solicitud.estado] || 'bg-slate-100 text-slate-700'">
                {{ solicitud.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  solicitudes: { id: string; tipo: string; fechaEnvio: string; estado: string }[]
  cargando: boolean
  error: boolean
}>()

const estadoBadge: Record<string, string> = {
  Aprobada: 'bg-green-100 text-green-700',
  Rechazada: 'bg-red-100 text-red-700',
  'En proceso': 'bg-blue-100 text-blue-700',
  'En revisión': 'bg-blue-100 text-blue-700',
  Pendiente: 'bg-[#fff2db] text-[#80531e]',
}
</script>

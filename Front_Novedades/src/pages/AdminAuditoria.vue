<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import http from '../utils/httpClient'
import { etiquetaSolicitud } from '../utils/solicitudDisplay'

interface Evento {
  id: string
  entidad: 'usuario' | 'solicitud'
  entidad_id: string
  referencia: string
  accion: string
  actor_nombre: string | null
  actor_rol: string | null
  estado_anterior: string | null
  estado_nuevo: string | null
  fecha: string
}

const nombres: Record<string, string> = {
  usuario_creado: 'Cuenta creada',
  usuario_actualizado: 'Cuenta actualizada',
  usuario_desactivado: 'Cuenta desactivada',
  usuario_eliminado: 'Cuenta eliminada',
  usuario_reactivado: 'Cuenta reactivada',
  solicitud_radicada: 'Solicitud radicada',
  solicitud_estado: 'Cambio de estado',
}
const formatos = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })
const route = useRoute()
const referencia = ref(typeof route.query.referencia === 'string' ? route.query.referencia : '')
const filtro = ref(referencia.value ? 'solicitud' : '')
const filtros = ref({ referencia: referencia.value, entidad: filtro.value, pagina: 1 })
const eventos = ref<Evento[]>([])
const siguiente = ref(false)
const cargando = ref(true)
const error = ref(false)
const pagina = computed(() => filtros.value.pagina)

function buscar(pagina = 1) {
  filtros.value = { referencia: referencia.value.trim(), entidad: filtro.value, pagina }
}

watch(filtros, async (params, _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  cargando.value = true
  error.value = false
  try {
    const { data } = await http.get<{ datos: { eventos: Evento[]; haySiguiente: boolean } }>('/admin/auditoria', {
      params: { ...params, entidad: params.entidad || undefined },
      signal: controller.signal,
    })
    if (controller.signal.aborted) return
    eventos.value = data.datos.eventos
    siguiente.value = data.datos.haySiguiente
  } catch {
    if (!controller.signal.aborted) error.value = true
  } finally {
    if (!controller.signal.aborted) cargando.value = false
  }
}, { immediate: true })
</script>

<template>
  <AdminLayout>
    <header class="banda-institucional mb-6 rounded-2xl px-5 py-7 sm:px-8">
      <h1 class="relative font-brand text-2xl text-white! sm:text-3xl">Auditoría</h1>
      <p class="relative mt-2 text-sm text-blue-100">Consulta quién gestionó las cuentas y las solicitudes y cuándo lo hizo.</p>
    </header>

    <section aria-label="Registro de actividad" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <form class="flex flex-wrap items-end gap-3 border-b border-slate-200 p-4 sm:p-5" @submit.prevent="buscar()">
        <label class="grid flex-1 basis-52 gap-1 text-sm font-semibold">
          Nombre o código de solicitud
          <input v-model="referencia" class="min-h-10 w-full rounded-lg border border-slate-300 px-3 font-normal" maxlength="120" />
        </label>
        <label class="grid flex-1 basis-36 gap-1 text-sm font-semibold">
          Tipo de registro
          <select v-model="filtro" class="min-h-10 w-full rounded-lg border border-slate-300 px-3 font-normal">
            <option value="">Todos</option>
            <option value="usuario">Cuentas</option>
            <option value="solicitud">Solicitudes</option>
          </select>
        </label>
        <button class="min-h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Buscar</button>
      </form>

      <Cargando v-if="cargando" texto="Cargando auditoría…" />
      <div v-else-if="error" role="alert" class="p-5 text-sm text-red-700">
        No se pudo consultar la auditoría.
        <button type="button" class="font-semibold underline" @click="buscar(pagina)">Reintentar</button>
      </div>
      <p v-else-if="!eventos.length" class="p-6 text-sm text-slate-600">No hay eventos para los filtros seleccionados.</p>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[38rem] text-left text-sm">
          <thead class="bg-blue-50 text-blue-700">
            <tr>
              <th scope="col" class="px-5 py-3">Fecha y hora (Colombia)</th>
              <th scope="col" class="px-5 py-3">Acción</th>
              <th scope="col" class="px-5 py-3">Referencia</th>
              <th scope="col" class="px-5 py-3">Responsable</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="evento in eventos" :key="evento.id">
              <td class="whitespace-nowrap px-5 py-3">{{ formatos.format(new Date(evento.fecha)) }}</td>
              <td class="px-5 py-3">
                <p class="font-semibold">{{ nombres[evento.accion] || evento.accion }}</p>
                <p v-if="evento.estado_anterior && evento.estado_nuevo" class="mt-1 text-xs text-slate-600">
                  {{ etiquetaSolicitud(evento.estado_anterior) }} → {{ etiquetaSolicitud(evento.estado_nuevo) }}
                </p>
              </td>
              <td class="px-5 py-3">
                <RouterLink
                  v-if="evento.entidad === 'solicitud'"
                  :to="{ name: 'AdminSolicitudDetalle', params: { id: evento.entidad_id }, query: { origen: 'auditoria' } }"
                  class="font-semibold text-blue-700 underline underline-offset-2"
                >{{ evento.referencia }}</RouterLink>
                <span v-else>{{ evento.referencia }}</span>
              </td>
              <td class="px-5 py-3">{{ evento.actor_nombre || 'Sin responsable registrado' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav v-if="!cargando && !error && (pagina > 1 || siguiente)" aria-label="Páginas de auditoría" class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4 text-sm">
        <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40" :disabled="pagina === 1" @click="buscar(pagina - 1)">Anterior</button>
        <span>Página {{ pagina }}</span>
        <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40" :disabled="!siguiente" @click="buscar(pagina + 1)">Siguiente</button>
      </nav>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import SecretariaLayout from '../components/layout/SecretariaLayout.vue'
import solicitudesService from '../services/solicitudesService'
import { etiquetaSolicitud } from '../utils/solicitudDisplay'

const route = useRoute()
const esAdmin = computed(() => route.meta.requiredRole === 'Administrador')
const esHistorial = computed(() => route.name === 'SecretariaHistorial')
const fechaColombia = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'America/Bogota' })
const tamanio = 8
const solicitudes = ref<Awaited<ReturnType<typeof solicitudesService.obtenerSolicitudes>>>([])
const buscar = ref('')
const programa = ref('')
const estado = ref('')
const pagina = ref(1)
const cargando = ref(true)
const error = ref(false)

function resuelta(estado: string) {
  return ['Aprobada', 'Rechazada', 'Cancelada'].includes(etiquetaSolicitud(estado))
}

const base = computed(() => {
  if (esAdmin.value) return solicitudes.value
  const coincidencias = solicitudes.value.filter(item => resuelta(item.estado) === esHistorial.value)
  if (!esHistorial.value) return coincidencias
  return coincidencias.sort((a, b) =>
    Date.parse(b.updated_at || b.created_at || '') - Date.parse(a.updated_at || a.created_at || ''),
  )
})
const programas = computed(() => [...new Set(base.value.flatMap(item => item.programa ? [item.programa] : []))].sort((a, b) => a.localeCompare(b, 'es-CO')))
const estados = computed(() => [...new Set(base.value.map(item => etiquetaSolicitud(item.estado)))])
const filtradas = computed(() => {
  const consulta = limpiar(buscar.value.trim())
  return base.value.filter(item =>
    (!consulta || limpiar([item.codigo_solicitud, item.nombre_estudiante, item.codigo_estudiantil, etiquetaSolicitud(item.tipo_solicitud)].join(' ')).includes(consulta)) &&
    (!estado.value || estado.value === etiquetaSolicitud(item.estado)) &&
    (!programa.value || programa.value === item.programa),
  )
})
const pendientes = computed(() => solicitudes.value.filter(item => !resuelta(item.estado)).length)
const aprobadas = computed(() => solicitudes.value.filter(item => etiquetaSolicitud(item.estado) === 'Aprobada').length)
const totalPaginas = computed(() => Math.max(1, Math.ceil(filtradas.value.length / tamanio)))
const filas = computed(() => filtradas.value.slice((pagina.value - 1) * tamanio, pagina.value * tamanio))
const titulo = computed(() => esHistorial.value ? 'Historial de solicitudes' : esAdmin.value ? 'Solicitudes académicas' : 'Bandeja de solicitudes')

watch([buscar, programa, estado], () => { pagina.value = 1 })
watch(() => route.name, () => {
  buscar.value = ''
  programa.value = ''
  estado.value = ''
  pagina.value = 1
  if (!cargando.value) void cargar()
})

async function cargar() {
  cargando.value = true
  error.value = false
  try {
    solicitudes.value = await solicitudesService.obtenerSolicitudes(undefined, { propagarError: true })
    pagina.value = Math.min(pagina.value, totalPaginas.value)
  } catch {
    error.value = true
  } finally {
    cargando.value = false
  }
}

function limpiar(valor: string) {
  return valor.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

function fecha(valor?: string) {
  return valor && Number.isFinite(Date.parse(valor)) ? fechaColombia.format(new Date(valor)) : '—'
}

function colorEstado(valor: string) {
  const colores: Record<string, string> = {
    Aprobada: 'bg-green-100 text-green-700',
    Rechazada: 'bg-red-100 text-red-700',
    Pendiente: 'bg-[#fff0d7] text-[#754d1a]',
  }
  return colores[etiquetaSolicitud(valor)] || 'bg-blue-50 text-blue-700'
}

onMounted(cargar)
</script>

<template>
  <component :is="esAdmin ? AdminLayout : SecretariaLayout">
    <header class="banda-institucional mb-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl px-5 py-7 sm:px-8">
      <div class="relative">
        <h1 class="font-brand text-2xl text-white! sm:text-3xl">{{ titulo }}</h1>
        <p class="mt-2 text-sm text-blue-100">
          {{ esHistorial ? 'Consulta las solicitudes que ya tienen una decisión registrada.' : 'Consulta los trámites académicos y abre el detalle para revisarlos.' }}
        </p>
      </div>
      <RouterLink
        v-if="!esAdmin"
        :to="{ name: esHistorial ? 'SecretariaSolicitudes' : 'SecretariaHistorial' }"
        class="relative rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
      >{{ esHistorial ? 'Ver bandeja' : 'Ver historial' }}</RouterLink>
    </header>

    <dl v-if="!esHistorial && !error" class="mb-5 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl border border-slate-200 border-l-4 border-l-[#d29a59] bg-white p-4 shadow-sm">
        <dt class="text-sm font-semibold text-slate-600">Por gestionar</dt>
        <dd><Cargando v-if="cargando" inline decorativo class="mt-2" /><span v-else class="text-3xl font-bold text-blue-700">{{ pendientes }}</span></dd>
      </div>
      <div class="rounded-xl border border-slate-200 border-l-4 border-l-blue-400 bg-white p-4 shadow-sm">
        <dt class="text-sm font-semibold text-slate-600">Aprobadas</dt>
        <dd><Cargando v-if="cargando" inline decorativo class="mt-2" /><span v-else class="text-3xl font-bold text-blue-700">{{ aprobadas }}</span></dd>
      </div>
    </dl>

    <section aria-label="Listado de solicitudes" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-wrap items-end gap-3 border-b border-slate-200 p-4 sm:p-5">
        <label class="grid flex-1 basis-56 gap-1 text-sm font-semibold">
          Buscar
          <input v-model="buscar" type="search" placeholder="Estudiante, código o trámite" class="min-h-10 w-full rounded-lg border border-slate-300 px-3 font-normal" />
        </label>
        <label class="grid flex-1 basis-44 gap-1 text-sm font-semibold">
          Programa
          <select v-model="programa" class="min-h-10 w-full rounded-lg border border-slate-300 px-3 font-normal">
            <option value="">Todos</option>
            <option v-for="item in programas" :key="item">{{ item }}</option>
          </select>
        </label>
        <label class="grid flex-1 basis-36 gap-1 text-sm font-semibold">
          Estado
          <select v-model="estado" class="min-h-10 w-full rounded-lg border border-slate-300 px-3 font-normal">
            <option value="">Todos</option>
            <option v-for="item in estados" :key="item">{{ item }}</option>
          </select>
        </label>
      </div>

      <Cargando v-if="cargando" texto="Cargando solicitudes…" />
      <p v-else-if="error" role="alert" class="p-5 text-sm text-red-700">
        No se pudieron cargar las solicitudes.
        <button type="button" class="font-semibold underline" @click="cargar">Reintentar</button>
      </p>
      <p v-else-if="!filas.length" class="p-6 text-sm text-slate-600">No hay solicitudes para los filtros seleccionados.</p>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[42rem] text-left text-sm">
          <thead class="bg-blue-50 text-blue-700">
            <tr>
              <th scope="col" class="px-4 py-3 sm:px-5">Código</th>
              <th scope="col" class="px-4 py-3">Estudiante</th>
              <th scope="col" class="px-4 py-3">Trámite</th>
              <th scope="col" class="px-4 py-3 whitespace-nowrap">{{ esHistorial ? 'Fecha de decisión' : 'Radicación' }}</th>
              <th scope="col" class="px-4 py-3">Estado</th>
              <th scope="col" class="px-4 py-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filas" :key="item.id" class="transition-colors hover:bg-blue-50/40">
              <th scope="row" class="px-4 py-3 font-semibold whitespace-nowrap text-blue-700 sm:px-5">{{ item.codigo_solicitud || item.id }}</th>
              <td class="px-4 py-3">
                {{ item.nombre_estudiante || '—' }}
                <p v-if="item.programa" class="mt-0.5 text-xs text-slate-600">{{ item.programa }}</p>
              </td>
              <td class="px-4 py-3">{{ etiquetaSolicitud(item.tipo_solicitud) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ fecha(esHistorial ? item.updated_at : item.created_at) }}</td>
              <td class="px-4 py-3">
                <span :class="colorEstado(item.estado)" class="inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap">{{ etiquetaSolicitud(item.estado) }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <RouterLink
                  :to="{ name: esAdmin ? 'AdminSolicitudDetalle' : 'SecretariaDetalle', params: { id: item.id }, query: esHistorial ? { origen: 'historial' } : {} }"
                  class="font-semibold whitespace-nowrap text-blue-700 underline-offset-2 hover:underline"
                >{{ resuelta(item.estado) ? 'Ver detalle' : 'Revisar' }}</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav v-if="!cargando && !error && totalPaginas > 1" aria-label="Páginas de solicitudes" class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4 text-sm">
        <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40" :disabled="pagina === 1" @click="pagina--">Anterior</button>
        <span>Página {{ pagina }} de {{ totalPaginas }}</span>
        <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40" :disabled="pagina === totalPaginas" @click="pagina++">Siguiente</button>
      </nav>
    </section>
  </component>
</template>

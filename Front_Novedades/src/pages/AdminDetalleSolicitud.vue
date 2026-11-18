<template>
  <component :is="esAdmin ? AdminLayout : SecretariaLayout">

    <!-- ── Topbar de la página ── -->
    <div class="banda-institucional mb-6 rounded-2xl px-4 py-5 sm:px-6">
      <!-- Volver + ID + estado -->
      <div class="relative flex flex-wrap items-center gap-4">
        <RouterLink :to="volver" class="flex items-center gap-1.5 text-sm font-semibold text-blue-100 hover:underline">
          <span aria-hidden="true">‹</span> Volver al listado
        </RouterLink>

        <div class="flex items-center gap-3">
          <span class="text-[17px] font-bold text-white tracking-tight">{{ solicitud?.id ?? route.params.id }}</span>
          <span :class="['text-[11.5px] font-bold px-2.5 py-1 rounded-full', estadoBadge(solicitud?.estado)]">
            {{ solicitud?.estado ?? '...' }}
          </span>
        </div>
      </div>

    </div>

    <!-- Skeleton global -->
    <Cargando v-if="isLoading" texto="Cargando detalle de la solicitud…" />

    <!-- Error -->
    <div v-else-if="error" class="p-5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Contenido -->
    <div v-else-if="solicitud" class="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,21rem)]">

      <!-- ── Columna izquierda ── -->
      <div class="min-w-0 space-y-4">

        <!-- Card: Información del Estudiante -->
        <section class="bg-white border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="flex items-center gap-2.5 px-6 py-4 border-b border-indigo-100 bg-indigo-50/40">
            <div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 class="text-[13.5px] font-bold text-slate-800">Información del Estudiante</h2>
          </div>

          <div class="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
            <!-- Avatar -->
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden shadow-sm">
              <span>{{ solicitud.estudiante?.nombre?.charAt(0) ?? '?' }}</span>
            </div>

            <!-- Grid de datos -->
            <div class="grid min-w-0 flex-1 gap-x-5 gap-y-4 break-words sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre Completo</p>
                <p class="text-[13px] font-semibold text-slate-800">{{ solicitud.estudiante?.nombre ?? '—' }}</p>
              </div>
              <div>
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Código Estudiantil</p>
                <p class="text-[13px] font-semibold text-slate-800 font-mono">{{ solicitud.estudiante?.codigo ?? '—' }}</p>
              </div>
              <div>
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Programa Académico</p>
                <p class="text-[13px] font-semibold text-slate-800">{{ solicitud.estudiante?.programa ?? '—' }}</p>
              </div>
              <div>
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Semestre Actual</p>
                <p class="text-[13px] font-semibold text-slate-800">{{ solicitud.estudiante?.semestre ?? '—' }}</p>
              </div>
              <div>
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Promedio (PAPA)</p>
                <p class="text-[13px] font-semibold text-slate-800">{{ solicitud.estudiante?.promedio ?? '—' }}</p>
              </div>
              <div>
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Institucional</p>
                <p class="text-[13px] font-semibold text-slate-800 truncate">{{ solicitud.estudiante?.email ?? '—' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Horario del estudiante -->
        <section class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <div class="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="17" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2 class="text-[13.5px] font-bold text-slate-800">Horario actual del estudiante</h2>
          </div>

          <div class="px-6 py-5">
            <Cargando v-if="horarioLoading" texto="Cargando horario…" />
            <p v-else-if="horarioError" class="text-sm text-red-600">{{ horarioError }}</p>
            <p v-else-if="materiasHorario.length === 0" class="text-sm text-slate-500">
              El estudiante no tiene materias matriculadas actualmente.
            </p>
            <div v-else class="overflow-x-auto">
              <table class="w-full min-w-[620px] text-left">
                <thead>
                  <tr class="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th class="pb-2 pr-4">Materia</th>
                    <th class="pb-2 pr-4">Día y hora</th>
                    <th class="pb-2 pr-4">Jornada</th>
                    <th class="pb-2 pr-4">Grupo / aula</th>
                    <th class="pb-2">Periodo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="materia in materiasHorario" :key="`${materia.id}-${materia.periodo}`" class="border-b border-slate-50 last:border-0">
                    <td class="py-3 pr-4">
                      <p class="text-[12px] font-semibold text-slate-700">{{ materia.nombre_curso }}</p>
                      <p class="text-[11px] text-slate-400">{{ materia.cod_curso }}</p>
                    </td>
                    <td class="py-3 pr-4 text-[12px] text-slate-600">
                      {{ materia.dia_semana }} · {{ materia.hora_inicio?.slice(0, 5) || "—" }}–{{ materia.hora_fin?.slice(0, 5) || "—" }}
                    </td>
                    <td class="py-3 pr-4 text-[12px] text-slate-600">{{ materia.jornada }}</td>
                    <td class="py-3 pr-4 text-[12px] text-slate-600">
                      {{ materia.codigo_grupo }}<span v-if="materia.aula"> · {{ materia.aula }}</span>
                    </td>
                    <td class="py-3 text-[12px] text-slate-600">{{ materia.periodo || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Card: Detalles de la Solicitud -->
        <section class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h2 class="text-[13.5px] font-bold text-slate-800">Detalles de la Solicitud: {{ solicitud.tipo }}</h2>
            </div>
            <span class="text-[11.5px] text-slate-400">Radicado el {{ solicitud.radicadoFecha }}</span>
          </div>

          <div class="px-6 py-5 space-y-5">
            <!-- Estados actual → solicitado -->
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="border border-slate-200 rounded-xl px-4 py-3">
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-2">Estado Actual</p>
                <div class="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ solicitud.estadoActual }}
                </div>
              </div>
              <div class="border-2 border-indigo-200 bg-indigo-50/30 rounded-xl px-4 py-3">
                <p class="text-[9.5px] font-bold uppercase tracking-wider text-indigo-400 mb-2">Estado Solicitado</p>
                <div class="flex items-center gap-2 text-[13px] font-semibold text-indigo-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ solicitud.estadoSolicitado }}
                </div>
              </div>
            </div>

            <!-- Justificación -->
            <div>
              <div class="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-600 mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Justificación del Estudiante
              </div>
              <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-[13px] text-slate-700 leading-relaxed">
                {{ solicitud.justificacion }}
              </div>
            </div>

            <!-- Documentos de soporte -->
            <div>
              <p class="text-[13px] font-bold text-slate-700 mb-3">Documentos de soporte</p>
              <p v-if="!solicitud.documentos.length" class="text-sm text-slate-600">Sin documentos adjuntos.</p>
              <div class="grid gap-3 sm:grid-cols-2">
                <a
                  v-for="doc in solicitud.documentos"
                  :key="doc.id"
                  :href="doc.url"
                  target="_blank" rel="noopener noreferrer"
                  class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:bg-white hover:border-indigo-200 transition-all group"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <span class="text-[12.5px] font-semibold text-slate-700 truncate">{{ doc.nombre }}</span>
                  </div>
                  <span class="text-[11.5px] font-semibold text-indigo-600 group-hover:text-indigo-700 whitespace-nowrap shrink-0">Ver archivo</span>
                </a>
              </div>
            </div>


          </div>
        </section>

      </div>

      <!-- ── Columna derecha ── -->
      <div class="min-w-0 space-y-4">

        <!-- Panel de Resolución -->
        <section v-if="esEditable" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2 class="text-[13.5px] font-bold text-slate-800">Panel de Resolución</h2>
          </div>

          <div class="px-5 py-5 space-y-4">
            <!-- Observaciones -->
            <div>
              <label class="block text-[12.5px] font-bold text-slate-700 mb-1.5">
                Observaciones y Comentarios <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="observaciones"
                maxlength="1000"
                rows="5"
                placeholder="Ingrese la justificación técnica de la aprobación o los motivos del rechazo..."
                :class="[
                  'w-full px-3.5 py-3 rounded-xl border text-[12.5px] text-slate-700 bg-slate-50',
                  'resize-none outline-none leading-relaxed transition-all duration-150 font-sans',
                  errObservaciones
                    ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white'
                ]"
              />
              <p v-if="errObservaciones" class="text-[11px] text-red-500 mt-1">{{ errObservaciones }}</p>
              <p class="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Este comentario será visible para el estudiante en su panel de historial.
              </p>
            </div>

            <!-- Botones acción -->
            <div class="grid grid-cols-2 gap-2.5">
              <button
                @click="resolver('rechazar')"
                :disabled="procesando !== null"
                class="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-bold disabled:opacity-50 transition-all"
              >
                <Cargando v-if="procesando === 'rechazar'" decorativo />
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Rechazar
              </button>
              <button
                @click="resolver('aprobar')"
                :disabled="procesando !== null"
                class="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-bold disabled:opacity-50 transition-all"
              >
                <Cargando v-if="procesando === 'aprobar'" decorativo />
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Aprobar
              </button>
            </div>
          </div>
        </section>

        <!-- Historial de Cambios -->
        <section class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <h2 class="text-[13.5px] font-bold text-slate-800">Historial de Cambios</h2>
          </div>

          <div class="px-5 py-4">
            <ol class="relative ml-2 space-y-5 border-l border-blue-100">
              <li v-for="(entrada, indice) in solicitud.historial" :key="entrada.id_evento" class="relative pl-5 text-sm">
                <span aria-hidden="true" class="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-white"
                  :class="indice === 0 ? 'bg-indigo-600' : 'bg-blue-400'"></span>
                <p class="font-bold text-blue-700">{{ entrada.descripcion }}</p>
                <p class="mt-1 text-xs text-slate-600">
                  <span v-if="entrada.estado_anterior">{{ etiquetaSolicitud(entrada.estado_anterior) }} → </span>
                  {{ etiquetaSolicitud(entrada.estado_nuevo) }}
                </p>
                <p class="mt-1 text-xs text-slate-600">
                  {{ formatearFecha(entrada.fecha) }} · {{ entrada.actor || 'Sin responsable registrado' }}
                </p>
                <p v-if="entrada.observacion" class="mt-2 rounded-lg bg-blue-50 p-3 text-xs leading-relaxed text-slate-700 whitespace-pre-line">{{ entrada.observacion }}</p>
              </li>
            </ol>
            <RouterLink
              v-if="esAdmin"
              :to="{ name: 'AdminAuditoria', query: { referencia: solicitud.id } }"
              class="mt-4 inline-block text-sm font-semibold text-blue-700 underline underline-offset-2"
            >Consultar en auditoría</RouterLink>
          </div>
        </section>



      </div>

    </div>

    <!-- Toast de confirmación -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast"
        role="status"
        @click="toast = null"
        :class="[
          'fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white z-50',
          toast.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'
        ]"
      >
        <svg v-if="toast.tipo === 'exito'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        {{ toast.mensaje }}
      </div>
    </Transition>

  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import solicitudesService from '../services/solicitudesService'
import estudianteService from '../services/estudianteService'
import AdminLayout from '../components/layout/AdminLayout.vue'
import SecretariaLayout from '../components/layout/SecretariaLayout.vue'
import { etiquetaSolicitud } from '../utils/solicitudDisplay'
import http from '../utils/httpClient'
import type { MateriaMatriculada } from '../types'

interface GrupoDetalle {
  nombre_curso: string
  codigo_grupo: string
}

interface Detalle {
  id_solicitud: number
  codigo_solicitud: string
  estado_solicitud: string
  fecha_creacion: string
  estudiante: {
    cod_alumno: string
    codigo_estudiantil: string
    nombre_completo: string
    correo_institucional: string
    semestre_actual: number
    promedio_acumulado: string | number | null
    programa: string
  }
  detalle_solicitud: {
    tipo_novedad: string
    motivo_novedad: string | null
    justificacion_detallada: string | null
    observaciones_resolucion: string | null
    grupo_actual: GrupoDetalle | null
    grupo_solicitado: GrupoDetalle | null
  }
  documentos: { id_documento: number; nombre_archivo: string; url_archivo: string }[]
  historial: {
    id_evento: number | string
    descripcion: string
    observacion: string | null
    estado_nuevo: string
    estado_anterior: string | null
    fecha: string
    actor: string | null
  }[]
}

const route = useRoute()
const esAdmin = computed(() => route.meta.requiredRole === 'Administrador')
const volver = computed(() => {
  if (route.query.origen === 'historial') return { name: 'SecretariaHistorial' }
  if (route.query.origen === 'auditoria') return { name: 'AdminAuditoria' }
  return { name: esAdmin.value ? 'AdminDashboard' : 'SecretariaSolicitudes' }
})
const bruto = ref<Detalle | null>(null)
const solicitud = computed(() => {
  if (!bruto.value) return null
  const { estudiante, detalle_solicitud: detalle, documentos, historial } = bruto.value
  return {
    id: bruto.value.codigo_solicitud,
    estado: etiquetaSolicitud(bruto.value.estado_solicitud),
    tipo: etiquetaSolicitud(detalle.tipo_novedad),
    radicadoFecha: formatearFecha(bruto.value.fecha_creacion),
    estadoActual: etiquetaGrupo(detalle.grupo_actual),
    estadoSolicitado: etiquetaGrupo(detalle.grupo_solicitado),
    justificacion: detalle.justificacion_detallada || 'No hay una justificación original disponible.',
    observacion: detalle.observaciones_resolucion,
    estudiante: {
      nombre: estudiante.nombre_completo,
      codigo: estudiante.codigo_estudiantil,
      programa: estudiante.programa,
      semestre: estudiante.semestre_actual,
      promedio: estudiante.promedio_acumulado,
      email: estudiante.correo_institucional,
    },
    documentos: documentos.map(doc => ({ id: doc.id_documento, nombre: doc.nombre_archivo, url: doc.url_archivo })),
    historial: [...historial].reverse(),
  }
})
const esEditable = computed(() => ['Pendiente', 'En revisión'].includes(solicitud.value?.estado || ''))
const id = computed(() => String(route.params.id ?? ''))
const recarga = ref(0)
const isLoading = ref(true)
const error = ref('')
const horarioLoading = ref(false)
const horarioError = ref('')
const materiasHorario = ref<MateriaMatriculada[]>([])
const observaciones = ref('')
const errObservaciones = ref('')
const procesando = ref<'aprobar' | 'rechazar' | null>(null)
const toast = ref<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null)
const formato = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })

watch([id, recarga], async ([solicitudId], _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  isLoading.value = true
  error.value = ''
  horarioError.value = ''
  horarioLoading.value = false
  materiasHorario.value = []
  bruto.value = null

  try {
    const { data } = await http.get<{ datos: Detalle }>('/solicitudes/' + encodeURIComponent(solicitudId) + '/detalle', {
      signal: controller.signal,
    })
    if (controller.signal.aborted) return
    bruto.value = data.datos
    const codigo = data.datos.estudiante.cod_alumno
    if (!codigo) return

    horarioLoading.value = true
    isLoading.value = false
    try {
      const materias = await estudianteService.getHorarioPorCodigo(String(codigo))
      if (!controller.signal.aborted) materiasHorario.value = materias
    } catch {
      if (!controller.signal.aborted) horarioError.value = 'No se pudo cargar el horario del estudiante.'
    } finally {
      if (!controller.signal.aborted) horarioLoading.value = false
    }
  } catch {
    if (!controller.signal.aborted) error.value = 'No se pudo cargar la solicitud.'
  } finally {
    if (!controller.signal.aborted) isLoading.value = false
  }
}, { immediate: true })

async function resolver(accion: 'aprobar' | 'rechazar') {
  if (procesando.value || !esEditable.value) return
  errObservaciones.value = ''
  if (!observaciones.value.trim()) {
    errObservaciones.value = 'Escribe el motivo de la decisión antes de continuar.'
    return
  }

  const referencia = id.value
  procesando.value = accion
  const estado = accion === 'aprobar' ? 'aprobada' : 'rechazada'
  try {
    await solicitudesService.actualizarEstado(referencia, { estado, observaciones: observaciones.value.trim() })
    if (referencia !== id.value) return
    observaciones.value = ''
    toast.value = { mensaje: 'Solicitud ' + estado + ' correctamente.', tipo: 'exito' }
    recarga.value++
  } catch (err) {
    toast.value = { mensaje: (err as { message?: string })?.message || 'No se pudo registrar la decisión.', tipo: 'error' }
  } finally {
    procesando.value = null
  }
}

function etiquetaGrupo(grupo: GrupoDetalle | null) {
  return grupo ? [grupo.nombre_curso, grupo.codigo_grupo].filter(Boolean).join(' · ') : '—'
}

function formatearFecha(valor: string) {
  return Number.isFinite(Date.parse(valor)) ? formato.format(new Date(valor)) : '—'
}

function estadoBadge(estado?: string) {
  const colores: Record<string, string> = {
    Aprobada: 'bg-green-100 text-green-700',
    Rechazada: 'bg-red-100 text-red-700',
    'En revisión': 'bg-indigo-50 text-indigo-700',
  }
  return colores[estado || ''] || 'bg-blue-50 text-blue-700'
}
</script>

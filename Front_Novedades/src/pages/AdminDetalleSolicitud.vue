<template>
  <SecretariaLayout>

    <!-- ── Topbar de la página ── -->
    <div class="flex items-center justify-between mb-6">
      <!-- Volver + ID + estado -->
      <div class="flex items-center gap-4">
        <button
          @click="router.back()"
          class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al Listado
        </button>

        <div class="flex items-center gap-3">
          <span class="text-[17px] font-bold text-slate-800 tracking-tight">{{ solicitud?.id ?? route.params.id }}</span>
          <span :class="['text-[11.5px] font-bold px-2.5 py-1 rounded-full', estadoBadge(solicitud?.estado)]">
            {{ solicitud?.estado ?? '...' }}
          </span>
        </div>
      </div>

    </div>

    <!-- Skeleton global -->
    <div v-if="isLoading" class="grid grid-cols-[1fr_300px] gap-5">
      <div class="space-y-4">
        <div class="h-44 bg-white border border-slate-200 rounded-2xl animate-pulse" />
        <div class="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse" />
        <div class="h-48 bg-white border border-slate-200 rounded-2xl animate-pulse" />
      </div>
      <div class="space-y-4">
        <div class="h-72 bg-white border border-slate-200 rounded-2xl animate-pulse" />
        <div class="h-56 bg-white border border-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Contenido -->
    <div v-else-if="solicitud" class="grid grid-cols-[1fr_300px] gap-5 items-start">

      <!-- ── Columna izquierda ── -->
      <div class="space-y-4">

        <!-- Card: Información del Estudiante -->
        <section class="bg-white border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="flex items-center gap-2.5 px-6 py-4 border-b border-indigo-100 bg-indigo-50/40">
            <div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 class="text-[13.5px] font-bold text-slate-800">Información del Estudiante</h2>
          </div>

          <div class="px-6 py-5 flex items-center gap-6">
            <!-- Avatar -->
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden shadow-sm">
              <span>{{ solicitud.estudiante?.nombre?.charAt(0) ?? '?' }}</span>
            </div>

            <!-- Grid de datos -->
            <div class="grid grid-cols-3 gap-x-8 gap-y-4 flex-1">
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
            <div class="grid grid-cols-2 gap-3">
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
              <p class="text-[13px] font-bold text-slate-700 mb-3">Documentos de Soporte</p>
              <div class="grid grid-cols-2 gap-3">
                <a
                  v-for="doc in solicitud.documentos"
                  :key="doc.nombre"
                  :href="doc.url"
                  target="_blank"
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

            <!-- Nota reglamento -->
            <div v-if="solicitud.notaReglamento" class="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p class="text-[12px] text-amber-700">{{ solicitud.notaReglamento }}</p>
            </div>
          </div>
        </section>

      </div>

      <!-- ── Columna derecha ── -->
      <div class="space-y-4">

        <!-- Panel de Resolución -->
        <section class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
                <svg v-if="procesando === 'rechazar'" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Rechazar
              </button>
              <button
                @click="resolver('aprobar')"
                :disabled="procesando !== null"
                class="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-bold disabled:opacity-50 transition-all"
              >
                <svg v-if="procesando === 'aprobar'" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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
            <ol class="relative border-l border-slate-200 ml-2 space-y-4">
              <li
                v-for="(entrada, i) in solicitud.historial"
                :key="i"
                class="pl-5 relative"
              >
                <!-- Dot -->
                <span
                  :class="[
                    'absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white',
                    entrada.activo ? 'bg-indigo-600' : 'bg-slate-300'
                  ]"
                />
                <p :class="['text-[13px] font-bold', entrada.activo ? 'text-slate-800' : 'text-slate-600']">
                  {{ entrada.titulo }}
                </p>
                <p class="text-[11.5px] text-slate-400 mt-0.5">{{ entrada.fecha }}</p>
                <p class="text-[11.5px] text-slate-500 mt-0.5">{{ entrada.actor }}</p>
              </li>
            </ol>

            <button class="mt-4 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Ver registro de auditoría completo
            </button>
          </div>
        </section>

        <!-- Guía de decisión -->
        <section v-if="solicitud.guiaDecision" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <h2 class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Guía de Decisión</h2>
          </div>
          <div class="px-5 py-4">
            <p class="text-[12px] text-slate-600 leading-relaxed">{{ solicitud.guiaDecision }}</p>
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

  </SecretariaLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import solicitudesService from '../services/solicitudesService'
import usuariosService from '../services/usuariosService'
import type { SolicitudDetalle, EstadoSolicitudAdmin } from '../types'
import SecretariaLayout from '../components/layout/SecretariaLayout.vue'

// ─── Router ──────────────────────────────────────────────────────────────────
const router = useRouter()
const route  = useRoute()
const id     = route.params.id as string

// ─── Estado ──────────────────────────────────────────────────────────────────
const solicitud      = ref<SolicitudDetalle | null>(null)
const isLoading      = ref(false)
const error          = ref<string | null>(null)
const observaciones  = ref('')
const errObservaciones = ref('')
const procesando     = ref<'aprobar' | 'rechazar' | null>(null)
const toast          = ref<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null)

// ─── Fetch ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  isLoading.value = true
  try {
    const raw = await solicitudesService.getDetalle(id) as unknown as SolicitudDetalle & Record<string, any>
    console.log('📋 Detalle solicitud raw:', JSON.stringify(raw, null, 2))

    // Mapear campos del backend al formato que espera el template
    raw.tipo = raw.tipo ?? raw.tipo_solicitud ?? '—'
    raw.estado = mapearEstado(raw.estado)
    raw.radicadoFecha = raw.radicadoFecha ?? formatearFecha(raw.created_at)
    raw.justificacion = raw.justificacion ?? raw.motivo ?? '—'
    raw.estadoActual = raw.estadoActual ?? raw.estado ?? '—'
    raw.estadoSolicitado = raw.estadoSolicitado ?? raw.tipo_solicitud?.replace(/_/g, ' ') ?? '—'

    const estudianteBase = {
      nombre: raw.estudiante?.nombre ?? raw.estudiante_nombre ?? raw.nombre_estudiante ?? raw.nombre ?? '—',
      codigo: raw.estudiante?.codigo ?? raw.estudiante_codigo ?? raw.codigo_estudiantil ?? raw.cod_alumno ?? '—',
      programa: raw.estudiante?.programa ?? raw.programa ?? raw.nombre_programa ?? raw.carrera ?? '—',
      semestre: raw.estudiante?.semestre ?? raw.semestre ?? 0,
      promedio: raw.estudiante?.promedio ?? raw.promedio ?? '—',
      email: raw.estudiante?.email ?? raw.email ?? raw.email_institucional ?? '—',
    }

    // Cargar datos reales del estudiante usando cod_alumno
    const codAlumno = raw.cod_alumno ?? raw.codigo_estudiantil
    if (codAlumno) {
      try {
        const resultado = await usuariosService.buscarUsuarios(codAlumno, 1)
        console.log('👤 Resultado búsqueda estudiante:', JSON.stringify(resultado, null, 2))
        const usuario = resultado.resultados?.[0]
        if (usuario) {
          raw.estudiante = {
            nombre:   usuario.nombre_completo ?? usuario.nombre ?? estudianteBase.nombre,
            codigo:   usuario.codigo_estudiantil ?? usuario.codigo_institucional ?? codAlumno,
            programa: usuario.programa ?? usuario.carrera ?? estudianteBase.programa,
            semestre: usuario.semestre ?? estudianteBase.semestre,
            promedio: usuario.promedio ?? estudianteBase.promedio,
            email:    usuario.email_institucional ?? usuario.email ?? estudianteBase.email,
          }
        } else {
          raw.estudiante = fallbackEstudiante(raw, codAlumno, estudianteBase)
        }
      } catch (e) {
        console.warn('⚠️ No se pudo buscar estudiante:', e)
        raw.estudiante = fallbackEstudiante(raw, codAlumno, estudianteBase)
      }
    } else if (!raw.estudiante || !raw.estudiante.nombre) {
      raw.estudiante = fallbackEstudiante(raw, '', estudianteBase)
    }

    solicitud.value = raw
  } catch (err: unknown) {
    error.value = (err as { message?: string })?.message ?? 'No se pudo cargar la solicitud.'
  } finally {
    isLoading.value = false
  }
})

// ─── Acciones ────────────────────────────────────────────────────────────────
async function resolver(accion: 'aprobar' | 'rechazar') {
  errObservaciones.value = ''

  if (!observaciones.value.trim()) {
    errObservaciones.value = 'Las observaciones son obligatorias antes de continuar.'
    return
  }

  procesando.value = accion
  try {
    const nuevoEstado = accion === 'aprobar' ? 'aprobada' : 'rechazada'
    await solicitudesService.actualizarEstado(id, {
      estado: nuevoEstado,
      observaciones: observaciones.value,
    })

    // Actualizar estado localmente
    if (solicitud.value) {
      solicitud.value.estado = accion === 'aprobar' ? 'Aprobada' : 'Rechazada'
    }

    mostrarToast(
      accion === 'aprobar'
        ? 'Solicitud aprobada correctamente.'
        : 'Solicitud rechazada correctamente.',
      'exito',
    )

    // Redirigir al listado tras 2 s
    setTimeout(() => router.back(), 2000)
  } catch (err: unknown) {
    mostrarToast(
      (err as { message?: string })?.message ?? 'Error al procesar la solicitud.',
      'error',
    )
  } finally {
    procesando.value = null
  }
}

function mostrarToast(mensaje: string, tipo: 'exito' | 'error') {
  toast.value = { mensaje, tipo }
  setTimeout(() => { toast.value = null }, 3500)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fallbackEstudiante(raw: Record<string, any>, codAlumno: string, base?: Record<string, any>) {
  return {
    nombre:   base?.nombre ?? raw.estudiante_nombre ?? raw.nombre_estudiante ?? raw.nombre ?? '—',
    codigo:   base?.codigo ?? raw.estudiante_codigo ?? raw.codigo_estudiantil ?? codAlumno ?? '—',
    programa: base?.programa ?? raw.programa ?? raw.nombre_programa ?? raw.carrera ?? '—',
    semestre: base?.semestre ?? raw.semestre ?? 0,
    promedio: base?.promedio ?? raw.promedio ?? '—',
    email:    base?.email ?? raw.email ?? raw.email_institucional ?? '—',
  }
}

function mapearEstado(estado: string): EstadoSolicitudAdmin {
  const mapa: Record<string, EstadoSolicitudAdmin> = {
    'PENDIENTE': 'Pendiente',
    'EN_REVISION': 'En Revisión',
    'EN_PROCESO': 'En proceso',
    'APROBADA': 'Aprobada',
    'RECHAZADA': 'Rechazada',
    'pendiente': 'Pendiente',
    'en_revision': 'En Revisión',
    'en_proceso': 'En proceso',
    'aprobada': 'Aprobada',
    'rechazada': 'Rechazada',
  }
  return mapa[estado] ?? estado as EstadoSolicitudAdmin
}

function formatearFecha(fecha: string): string {
  if (!fecha) return ''
  try {
    return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return fecha
  }
}

function estadoBadge(estado?: EstadoSolicitudAdmin): string {
  const map: Record<EstadoSolicitudAdmin, string> = {
    'Aprobada':    'bg-green-100 text-green-700',
    'Rechazada':   'bg-red-100 text-red-600',
    'En proceso':  'bg-blue-100 text-blue-600',
    'Pendiente':   'bg-slate-100 text-slate-600',
    'En Revisión': 'bg-amber-100 text-amber-700',
  }
  return estado ? (map[estado] ?? 'bg-slate-100 text-slate-500') : 'bg-slate-100 text-slate-500'
}
</script>

<template>
  <DashboardLayout>
    <!-- Panel de éxito tras creación -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
      <div v-if="solicitudCreada" class="max-w-2xl mx-auto py-8">
        <div class="bg-white border border-emerald-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="bg-emerald-50 border-b border-emerald-100 px-6 py-5 flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-emerald-800">Solicitud Registrada</h2>
              <p class="text-sm text-emerald-600">Código: <span class="font-mono font-bold">{{ solicitudCreada.codigo_solicitud }}</span></p>
            </div>
          </div>

          <div class="px-6 py-4 space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-slate-50 rounded-xl px-4 py-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Estado</p>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {{ solicitudCreada.estado }}
                </span>
              </div>
              <div class="bg-slate-50 rounded-xl px-4 py-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tipo</p>
                <p class="text-sm font-semibold text-slate-700">{{ solicitudCreada.tipo_solicitud }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl px-4 py-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Fecha</p>
                <p class="text-sm font-semibold text-slate-700">{{ new Date(solicitudCreada.created_at).toLocaleDateString('es-CO') }}</p>
              </div>
            </div>

            <!-- Validaciones -->
            <div v-if="solicitudCreada.validacion_json?.validaciones?.length" class="border border-slate-200 rounded-xl overflow-hidden">
              <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 class="text-[13px] font-bold text-slate-700">Validaciones Académicas</h3>
              </div>
              <ul class="divide-y divide-slate-100">
                <li v-for="v in solicitudCreada.validacion_json.validaciones" :key="v.nombre" class="flex items-center gap-3 px-4 py-3">
                  <div :class="['w-6 h-6 rounded-full flex items-center justify-center shrink-0', v.resultado ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600']">
                    <svg v-if="v.resultado" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-semibold text-slate-700">{{ v.nombre.replace(/_/g, ' ') }}</p>
                    <p class="text-xs text-slate-400">{{ v.detalle }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <p class="text-sm text-slate-500 leading-relaxed">Su solicitud quedará en revisión por la secretaría académica. Puede consultar el estado en su historial.</p>

            <div class="flex gap-3 pt-2">
              <button @click="solicitudCreada = null" class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Nueva Solicitud</button>
              <button @click="router.push({ name: 'MiHistorial' })" class="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold transition-all shadow-md shadow-indigo-200">Ver Mi Historial</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <nav v-if="!solicitudCreada" class="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
      <span class="text-slate-500">Trámites Académicos</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      <span class="text-indigo-600 font-semibold">Nueva Solicitud</span>
    </nav>

    <div v-if="!solicitudCreada" class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800 tracking-tight mb-1.5">Formulario de Solicitud</h1>
      <p class="text-sm text-slate-500 leading-relaxed max-w-xl">Complete los siguientes campos para formalizar su requerimiento ante la secretaría académica. Asegúrese de adjuntar los soportes necesarios.</p>
    </div>

    <div v-if="!solicitudCreada && form.tipo" class="flex items-start gap-3 bg-indigo-50 border border-indigo-200 border-l-[3px] border-l-indigo-500 rounded-xl px-4 py-3.5 mb-5">
      <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="text-sm text-indigo-800 leading-relaxed">
        <span class="block text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-0.5">Ayuda rápida</span>
        Usted está realizando una solicitud de <strong>{{ form.tipo }}</strong>. El tiempo estimado de respuesta es de 3 a 5 días hábiles.
      </div>
    </div>

    <div v-if="!solicitudCreada" class="max-w-2xl space-y-4 pb-24">
      <!-- Información Académica -->
      <section class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="flex items-start gap-3 px-6 py-5 border-b border-slate-100">
          <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <h2 class="text-[14px] font-bold text-slate-800">Información Académica</h2>
            <p class="text-xs text-slate-400 mt-0.5">Datos cargados automáticamente desde su registro institucional.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 divide-x divide-y divide-slate-100">
          <div class="px-6 py-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre Completo</p><p class="text-[13.5px] font-semibold text-slate-800">{{ student?.nombre ?? '—' }}</p></div>
          <div class="px-6 py-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Código Estudiante</p><p class="text-[13.5px] font-semibold text-slate-800 font-mono">{{ student?.codigo ?? '—' }}</p></div>
          <div class="px-6 py-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Programa Académico</p><p class="text-[13.5px] font-semibold text-slate-800">{{ student?.carrera ?? '—' }}</p></div>
          <div class="px-6 py-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Semestre Actual</p><p class="text-[13.5px] font-semibold text-slate-800">{{ student?.semestre ? `${student.semestre}º Semestre` : '—' }}</p></div>
        </div>
      </section>

      <!-- Detalles de la Solicitud -->
      <section class="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
        <div class="flex items-start gap-3 pb-5 border-b border-slate-100 mb-5">
          <div class="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 text-indigo-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div>
            <h2 class="text-[14px] font-bold text-slate-800">Detalles de la Solicitud</h2>
            <p class="text-xs text-slate-400 mt-0.5">Seleccione el tipo de trámite y proporcione la información requerida.</p>
          </div>
        </div>

        <div class="mb-5">
          <label class="block text-[13px] font-semibold text-slate-700 mb-2">Tipo de Solicitud <span class="text-red-500">*</span></label>
          <div class="relative">
            <select v-model="form.tipo" @change="onTipoChange" :class="['w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border text-sm text-slate-700 bg-slate-50 outline-none transition-all cursor-pointer', errors.tipo ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white']">
              <option value="">— Seleccione un tipo de trámite —</option>
              <option v-for="t in TIPOS" :key="t" :value="t">{{ t }}</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <p v-if="errors.tipo" class="text-[11.5px] text-red-500 mt-1 font-medium">{{ errors.tipo }}</p>
        </div>

        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
          <div v-if="form.tipo === 'Cambio de Curso'" class="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Curso Actual</p><BaseInput v-model="form.cursoActual" placeholder="Ej: Cálculo Integral - G-02" /></div>
            <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Nuevo Curso Solicitado</p><BaseInput v-model="form.cursoNuevo" placeholder="Ej: Cálculo Integral - G-35" /></div>
          </div>
        </Transition>

        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
          <div v-if="form.tipo === 'Cambio de Jornada'" class="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <!-- Jornada actual -->
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Jornada Actual</p>
              <select v-model="form.jornadaActual" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all">
                <option value="">Seleccione</option>
                <option v-for="j in jornadasDisponibles" :key="j" :value="j">
                  {{ j }}
                </option>
              </select>
            </div>

            <!-- Jornada nueva -->
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Nueva Jornada</p>
              <select v-model="form.jornadaNueva" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all">
                <option value="">Seleccione</option>
                <option v-for="j in jornadasDisponibles" :key="j" :value="j">
                  {{ j }}
                </option>
              </select>
            </div>
          </div>
        </Transition>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-[13px] font-semibold text-slate-700">Justificación de la Solicitud <span class="text-red-500">*</span></label>
            <span :class="['text-[11px] tabular-nums', form.descripcion.length > 370 ? 'text-amber-500 font-semibold' : 'text-slate-400']">{{ form.descripcion.length }} / 400</span>
          </div>
          <textarea v-model="form.descripcion" maxlength="400" rows="5" placeholder="Explique detalladamente los motivos de su solicitud (mínimo 50 caracteres)..." :class="['w-full px-3.5 py-3 rounded-xl border text-sm text-slate-700 bg-slate-50 resize-none outline-none leading-relaxed transition-all', errors.descripcion ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white']" />
          <p v-if="errors.descripcion" class="text-[11.5px] text-red-500 mt-1 font-medium">{{ errors.descripcion }}</p>
          <p class="flex items-center gap-1.5 text-[11.5px] text-slate-400 mt-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Mín. 50 caracteres para habilitar el envío de la solicitud.
          </p>
        </div>
      </section>

      <!-- Documentos Adjuntos -->
      <section class="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
        <div class="flex items-start gap-3 pb-5 border-b border-slate-100 mb-5">
          <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <h2 class="text-[14px] font-bold text-slate-800">Documentos Adjuntos</h2>
            <p class="text-xs text-slate-400 mt-0.5">Suba los soportes que validen su justificación (ej. certificados laborales, médicos, o cruces de horario).</p>
          </div>
        </div>
        <div @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="handleDrop" @click="fileInput?.click()" :class="['border-2 border-dashed rounded-xl py-10 text-center cursor-pointer transition-all duration-200', isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40']">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all', isDragging ? 'bg-indigo-100 text-indigo-500' : 'bg-slate-200 text-slate-400']">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <p class="text-sm font-semibold text-slate-600 mb-1">Haga clic o arrastre archivos aquí</p>
          <p class="text-xs text-slate-400">PDF, JPEG o PNG (Máx. 5 MB por archivo)</p>
        </div>
        <input ref="fileInput" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" class="hidden" @change="handleFileChange" />
        <TransitionGroup tag="ul" class="mt-3 space-y-2" enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 -translate-x-2" enter-to-class="opacity-100 translate-x-0">
          <li v-for="(f, i) in form.archivos" :key="f.name + i" class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 group hover:bg-white transition-colors">
            <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-slate-700 truncate">{{ f.name }}</p>
              <p class="text-[11px] text-slate-400">{{ formatSize(f.size) }}</p>
            </div>
            <button @click.stop="removeFile(i)" class="text-[12px] font-semibold text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">Eliminar</button>
          </li>
        </TransitionGroup>
      </section>
    </div>

    <!-- Footer sticky -->
    <div v-if="!solicitudCreada" class="fixed bottom-0 left-40 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-8 py-3.5 flex items-center justify-between z-30 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
      <div class="flex items-center gap-1.5 text-[11.5px] text-slate-400">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Campos obligatorios marcados con asterisco (*)
      </div>
      <div class="flex items-center gap-2.5">
        <button @click="router.back()" class="px-5 py-2 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar y Volver</button>
        <button @click="handleSubmit" :disabled="isLoading" class="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[13px] font-bold transition-all shadow-md shadow-indigo-200 hover:-translate-y-px active:translate-y-0">
          <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {{ isLoading ? 'Enviando...' : 'Enviar Solicitud' }}
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../store/authStore'
import solicitudesService from '../services/solicitudesService'
import type { TipoTramite, SolicitudCreada } from '../types'
import DashboardLayout from '../components/layout/Dashboardlayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'


const router = useRouter(); const route = useRoute()
const { student } = storeToRefs(useAuthStore())
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false); const isDragging = ref(false)
const solicitudCreada = ref<SolicitudCreada | null>(null)

const TIPOS: TipoTramite[] = ['Cambio de Curso','Cambio de Jornada','Curso Dirigido','Adición de Curso']
const jornadasDisponibles = ['mañana', 'tarde', 'noche']

const form = ref({ tipo: '' as TipoTramite | '', descripcion: '', codigoCursoActual: '', codigoCursoNuevo: '', cursoActual: '', cursoNuevo: '', jornadaActual: '', jornadaNueva: '', archivos: [] as File[] })
const errors = ref({ tipo: '', descripcion: '' })

onMounted(() => {
  const tipo = route.query.tipo as TipoTramite | undefined
  if (tipo && TIPOS.includes(tipo)) form.value.tipo = tipo
})

function onTipoChange() {
  if (form.value.tipo !== 'Cambio de Curso') { form.value.codigoCursoActual = ''; form.value.codigoCursoNuevo = ''; form.value.cursoActual = ''; form.value.cursoNuevo = '' }
  if (form.value.tipo !== 'Cambio de Jornada') { form.value.jornadaActual = ''; form.value.jornadaNueva = '' }
  errors.value.tipo = ''
}

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) form.value.archivos.push(...Array.from(files))
  if (fileInput.value) fileInput.value.value = ''
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) form.value.archivos.push(...Array.from(files))
}

function removeFile(i: number) { form.value.archivos.splice(i, 1) }
function formatSize(bytes: number) { return bytes < 1048576 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/1048576).toFixed(1)} MB` }

function validate() {
  errors.value = { tipo: '', descripcion: '' }
  if (!form.value.tipo) errors.value.tipo = 'Seleccione un tipo de trámite.'
  if (form.value.descripcion.trim().length < 50) errors.value.descripcion = 'La justificación debe tener al menos 50 caracteres.'
  return !errors.value.tipo && !errors.value.descripcion
}

async function handleSubmit() {
  if (!validate()) return
  if (!student.value?.codigo) {
    errors.value.descripcion = 'Error: Datos de estudiante incompletos. Por favor recarga la página.'
    return
  }
  
  isLoading.value = true
  try {
    const payload: any = {
      tipo: form.value.tipo,
      descripcion: form.value.descripcion,
      codigo_estudiantil: student.value.codigo,
      email_estudiante: student.value.email,
      nombre_estudiante: student.value.nombre,
    }

    if (form.value.tipo === 'Cambio de Curso') {
      payload.codigo_curso_actual = form.value.codigoCursoActual
      payload.codigo_curso_nuevo = form.value.codigoCursoNuevo
      payload.curso_actual = form.value.cursoActual
      payload.curso_nuevo = form.value.cursoNuevo
    }

    if (form.value.tipo === 'Cambio de Jornada') {
      payload.jornada_actual = form.value.jornadaActual
      payload.jornada_nueva = form.value.jornadaNueva
    }

    if (form.value.archivos.length > 0) {
      payload.archivos = form.value.archivos
    }

    console.log('📤 Enviando solicitud:', { ...payload, archivos: `${payload.archivos?.length ?? 0} archivo(s)` })
    
    const respuesta = await solicitudesService.crear(payload)
    console.log('✅ Respuesta servidor:', respuesta)
    
    solicitudCreada.value = respuesta
    console.log('✅ Solicitud enviada exitosamente:', respuesta.codigo_solicitud)
  } catch (err: any) {
    console.error('❌ Error al enviar solicitud:', err)
    
    // Intentar extraer el mensaje de error más específico
    let mensaje = 'Error al enviar la solicitud.'
    if (err.response?.data?.mensaje) {
      mensaje = err.response.data.mensaje
    } else if (err.response?.data?.error) {
      mensaje = err.response.data.error
    } else if (err.response?.data?.message) {
      mensaje = err.response.data.message
    } else if (err.message) {
      mensaje = err.message
    }
    
    console.error('📋 Mensaje de error:', mensaje)
    errors.value.descripcion = mensaje
  } finally { isLoading.value = false }
}
</script>

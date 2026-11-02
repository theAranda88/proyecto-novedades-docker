<template>
  <DashboardLayout>
    <template #header>
      <AppHeader />
    </template>
    <template #sidebar>
      <AppSidebar @logout="handleLogout" />
    </template>

    <div class="max-w-3xl mx-auto space-y-6">

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="toast.visible"
          class="fixed top-6 right-6 z-50 w-[min(92vw,28rem)] rounded-2xl border shadow-2xl backdrop-blur-sm p-4"
          :class="toast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-400/40 text-emerald-100'
            : 'bg-rose-950/95 border-rose-400/40 text-rose-100'"
          role="alert"
          aria-live="assertive"
        >
          <div class="flex items-start gap-3">
            <div class="mt-0.5">
              <svg
                v-if="toast.type === 'success'"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-rose-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 4h.01M4.938 19h14.124c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.206 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold">
                {{ toast.type === 'success' ? 'Solicitud enviada' : 'No se pudo enviar la solicitud' }}
              </p>
              <p class="text-sm leading-6 whitespace-pre-line mt-1 opacity-95">{{ toast.message }}</p>
            </div>

            <button
              class="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
              type="button"
              @click="closeToast"
              aria-label="Cerrar notificación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>

      <FormHeader />

      <QuickHelp :tipo-solicitud="form.tipoSolicitud" />

      <AcademicInfo :student="authStore.student" />

      <ApplicationDetails
        v-model="form"
        :jornadaActual="student?.jornada"
        :materiasMatriculadasExterno="materiasMatriculadasVista"
        :conflictoValidacion="conflictoValidacion"
      />

      <AttachedDocuments v-model="form.archivos" />

      <!-- Footer -->
      <div class="flex items-center justify-between pb-8">
        <p class="text-xs text-slate-400">Campos obligatorios marcados con asterisco (*)</p>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300
                   rounded-lg hover:bg-slate-50 transition-colors"
            @click="router.push({ name: 'Dashboard' })"
          >
            Cancelar y Volver
          </button>
          <button
            class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
                   bg-[var(--color-orange)] rounded-lg hover:bg-[var(--color-orange-dark)] active:bg-[var(--color-orange-dark)] transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!formularioValido || isSubmitting"
            @click="handleSubmit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11zM21.854 2.147l-10.94 10.939"/>
            </svg>
            {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import DashboardLayout from '../components/dashboard/DashboardLayout.vue'
import AppHeader from '../components/dashboard/AppHeader.vue'
import AppSidebar from '../components/dashboard/AppSidebar.vue'
import FormHeader from '../components/solicitud/FormHeader.vue'
import QuickHelp from '../components/solicitud/QuickHelp.vue'
import AcademicInfo from '../components/solicitud/AcademicInfo.vue'
import ApplicationDetails from '../components/solicitud/ApplicationDetails.vue'
import AttachedDocuments from '../components/solicitud/AttachedDocuments.vue'

import { useAuthStore } from '../store/authStore'
import solicitudesService from '../services/solicitudesService'
import estudianteService from '../services/estudianteService'
import grupoService from '../services/grupoService'
import type { TipoTramite, Grupo, MateriaMatriculada } from '../types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { student } = storeToRefs(authStore)
const isSubmitting = ref(false)
const toast = ref({
  visible: false,
  type: 'error' as 'error' | 'success',
  message: '',
})
let toastTimer: ReturnType<typeof setTimeout> | null = null

const form = ref({
  tipoSolicitud: '' as TipoTramite | '',
  codigoCursoActual: '',
  codigoCursoNuevo: '',
  cursoActual: '',
  nuevoCurso: '',
  grupoActualId: null as number | null,
  grupoNuevoId: null as number | null,
  jornadaActual: '',
  jornadaNueva: '',
  materia: '',
  cursoAdicionar: '',
  motivoCancelacion: '',
  materiaExamen: '',
  motivoExamen: '',
  programaActual: '',
  programaNuevo: '',
  justificacion: '',
  archivos: [] as File[],
})

const materiasMatriculadasVista = ref<MateriaMatriculada[]>([])
const conflictoValidacion = ref<{
  tipo: 'cruce' | 'matriculada'
  grupoNuevoId: number
  curso?: string
  dia?: string
  horaInicio?: string
  horaFin?: string
} | null>(null)

// Cargar el tipo de solicitud desde query params si existe
onMounted(() => {
  const tipoParam = route.query.tipo as string
  if (tipoParam) {
    console.log('📋 Tipo de solicitud desde acciones rápidas:', tipoParam)
    form.value.tipoSolicitud = tipoParam as TipoTramite
  }

  estudianteService.getMateriasMatriculadas()
    .then((materias) => {
      materiasMatriculadasVista.value = materias
    })
    .catch(() => {
      materiasMatriculadasVista.value = []
    })
})

const formularioValido = computed(() => {
  const tipoValido = !!form.value.tipoSolicitud
  const justificacionValida = form.value.justificacion.length >= 50
  
  // Validar campos específicos según el tipo
  let camposEspecificosValidos = true
  
  if (form.value.tipoSolicitud === 'Cambio de Curso') {
    camposEspecificosValidos = !!form.value.codigoCursoActual && !!form.value.codigoCursoNuevo && !!form.value.cursoActual && !!form.value.nuevoCurso
  } else if (form.value.tipoSolicitud === 'Cambio de Jornada') {
    camposEspecificosValidos = !!form.value.jornadaActual && !!form.value.jornadaNueva
  } else if (form.value.tipoSolicitud === 'Curso Dirigido') {
    camposEspecificosValidos = !!form.value.materia
  } else if (form.value.tipoSolicitud === 'Adición de Curso') {
    camposEspecificosValidos = !!form.value.cursoAdicionar
  } else if (form.value.tipoSolicitud === 'Cancelación de Semestre') {
    camposEspecificosValidos = !!form.value.motivoCancelacion
  } else if (form.value.tipoSolicitud === 'Examen Supletorio') {
    camposEspecificosValidos = !!form.value.materiaExamen && !!form.value.motivoExamen
  } else if (form.value.tipoSolicitud === 'Cambio de Programa') {
    camposEspecificosValidos = !!form.value.programaActual && !!form.value.programaNuevo
  }
  
  return tipoValido && justificacionValida && camposEspecificosValidos
})

function closeToast() {
  toast.value.visible = false
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
}

function showToast(type: 'error' | 'success', message: string, autoCloseMs = 6500) {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }

  toast.value = {
    visible: true,
    type,
    message,
  }

  if (autoCloseMs > 0) {
    toastTimer = setTimeout(() => {
      toast.value.visible = false
      toastTimer = null
    }, autoCloseMs)
  }
}

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}

function aMinutos(hora: string): number {
  const [h, m] = hora.slice(0, 5).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function hayCruceHorario(grupoA: Grupo, grupoB: Grupo): boolean {
  if (grupoA.dia_semana.toLowerCase() !== grupoB.dia_semana.toLowerCase()) {
    return false
  }

  const inicioA = aMinutos(grupoA.hora_inicio)
  const finA = aMinutos(grupoA.hora_fin)
  const inicioB = aMinutos(grupoB.hora_inicio)
  const finB = aMinutos(grupoB.hora_fin)

  return inicioA < finB && inicioB < finA
}

async function handleSubmit() {
  if (!formularioValido.value) return
  if (!student.value?.codigo) {
    showToast('error', 'Datos de estudiante incompletos. Por favor recarga la página.')
    return
  }

  conflictoValidacion.value = null

  isSubmitting.value = true
  try {
    console.log('📝 Preparando solicitud...')

    // Mapear tipo de solicitud al formato backend (snake_case)
    const tipoMap: Record<string, string> = {
      'Cambio de Curso':    'cambio_curso',
      'Cambio de Jornada':  'cambio_jornada',
      'Curso Dirigido':     'curso_dirigido',
      'Adición de Curso':   'adicion_curso',
      'Cancelación de Semestre': 'cancelacion_semestre',
      'Examen Supletorio':  'examen_supletorio',
      'Cambio de Programa': 'cambio_programa',
    }

    // Mapear jornada display → formato backend
    const jornadaMap: Record<string, string> = {
      'Mañana': 'manana', 'Tarde': 'tarde', 'Noche': 'noche',
      'mañana': 'manana', 'tarde': 'tarde', 'noche': 'noche',
    }

    // Calcular periodo académico actual
    const ahora = new Date()
    const periodoAcademico = `${ahora.getFullYear()}-${ahora.getMonth() + 1 <= 6 ? 1 : 2}`

    const payload: Record<string, any> = {
      tipo_solicitud:    tipoMap[form.value.tipoSolicitud] || form.value.tipoSolicitud,
      justificacion:     form.value.justificacion,
      periodo_academico: periodoAcademico,
    }

    // Agregar campos específicos según el tipo
    if (form.value.tipoSolicitud === 'Cambio de Curso') {
      payload.grupo_actual_id = form.value.grupoActualId
      payload.grupo_nuevo_id  = form.value.grupoNuevoId
    }

    if (form.value.tipoSolicitud === 'Cambio de Jornada') {
      payload.jornada_actual = jornadaMap[form.value.jornadaActual] || form.value.jornadaActual
      payload.jornada_nueva  = jornadaMap[form.value.jornadaNueva]  || form.value.jornadaNueva
    }

    if (form.value.tipoSolicitud === 'Curso Dirigido') {
      payload.grupo_nuevo_id = form.value.grupoNuevoId
    }

    if (form.value.tipoSolicitud === 'Adición de Curso') {
      payload.grupo_nuevo_id = form.value.grupoNuevoId
    }

    if (form.value.tipoSolicitud === 'Cancelación de Semestre') {
      payload.motivo_cancelacion = form.value.motivoCancelacion
    }

    if (form.value.tipoSolicitud === 'Examen Supletorio') {
      payload.grupo_nuevo_id = form.value.grupoNuevoId
      payload.motivo_examen  = form.value.motivoExamen
    }

    if (form.value.tipoSolicitud === 'Cambio de Programa') {
      payload.programa_actual = form.value.programaActual
      payload.programa_nuevo  = form.value.programaNuevo
    }

    // Validación previa UX: evitar envío si el grupo nuevo cruza horario o ya está inscrito
    if (payload.grupo_nuevo_id) {
      const [materiasMatriculadas, catalogoGrupos] = await Promise.all([
        estudianteService.getMateriasMatriculadas(),
        grupoService.obtenerTodosLosCursos(),
      ])

      materiasMatriculadasVista.value = materiasMatriculadas

      const grupoNuevo = catalogoGrupos.find(g => g.id === Number(payload.grupo_nuevo_id))

      if (materiasMatriculadas.some(m => m.id === Number(payload.grupo_nuevo_id))) {
        conflictoValidacion.value = {
          tipo: 'matriculada',
          grupoNuevoId: Number(payload.grupo_nuevo_id),
        }
        showToast('error', '• Ya tienes esta materia/grupo matriculado. Selecciona un grupo diferente.')
        return
      }

      if (grupoNuevo) {
        const grupoCruce = materiasMatriculadas.find((m) => hayCruceHorario(m as Grupo, grupoNuevo))
        if (grupoCruce) {
          conflictoValidacion.value = {
            tipo: 'cruce',
            grupoNuevoId: Number(payload.grupo_nuevo_id),
            curso: grupoCruce.nombre_curso,
            dia: grupoCruce.dia_semana,
            horaInicio: grupoCruce.hora_inicio.slice(0, 5),
            horaFin: grupoCruce.hora_fin.slice(0, 5),
          }
          showToast(
            'error',
            `• El grupo seleccionado cruza horario con ${grupoCruce.nombre_curso} (${grupoCruce.dia_semana} ${grupoCruce.hora_inicio.slice(0,5)}-${grupoCruce.hora_fin.slice(0,5)}).`
          )
          return
        }
      }
    }

    console.log('📤 Enviando solicitud:', payload)

    // Llamar al backend
    const response = await solicitudesService.crear(payload, form.value.archivos)
    
    console.log('✅ Solicitud creada:', response)
    
    // Mostrar confirmación y redirigir
    showToast('success', 'Solicitud enviada exitosamente a la secretaría académica.', 2200)
    await new Promise(resolve => setTimeout(resolve, 750))
    await router.push({ name: 'Dashboard' })
  } catch (error: any) {
    console.error('❌ Error al enviar:', error)
    const errorMessage = String(error?.message || 'No se pudo enviar la solicitud. Intenta de nuevo.')
      .replaceAll(' | ', '\n• ')
      .replaceAll('|', '\n• ')

    showToast('error', `• ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
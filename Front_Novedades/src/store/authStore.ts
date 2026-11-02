import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'
import estudianteService from '../services/estudianteService'
import Storage from '../utils/storage'
import type { StudentInfo, LoginPayload, ChangePasswordPayload } from '../types'

export const useAuthStore = defineStore('auth', () => {

  // ─── Mock de estudiante ─────────────────────────────────────
  const mockStudent = ref<StudentInfo>({
    id: '1',
    nombre: 'Alejandro',
    codigo: '20401',
    carrera: 'Ingeniería de Sistemas',
    semestre: 8,
    email: 'juan.perez@universidad.edu'
  })

  // ─── Estado ────────────────────────────────────────────────
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const student = ref<StudentInfo | null>(
    JSON.parse(localStorage.getItem('auth_student') || 'null')
  )
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ─── Computed ───────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const studentFirstName = computed(() => student.value?.nombre?.split(' ')[0] ?? '')

  // ─── Acciones ───────────────────────────────────────────────
  async function login(payload: LoginPayload): Promise<{ requiresPasswordChange: boolean }> {
    isLoading.value = true
    error.value = null
    try {
      console.log('🔐 authStore.login iniciando...')
      const response = await authApi.login(payload)
      console.log('✅ authApi.login respondió:', response)

      token.value = response.token
      student.value = response.student

      console.log('💾 Guardando en localStorage...')
      Storage.setToken(response.token)
      Storage.setStudent(response.student)
      Storage.setFirstLogin(response.requiresPasswordChange)

      try {
        console.log('📚 Cargando perfil académico completo...')
        const perfilAcademico = await estudianteService.getPerfilAcademico()
        console.log('✅ Perfil académico cargado:', perfilAcademico)

        if (student.value) {
          student.value.semestre = perfilAcademico.semestre
          student.value.programa = perfilAcademico.programa || perfilAcademico.nombre_programa
          student.value.jornada = perfilAcademico.jornada
          student.value.creditos_inscritos = perfilAcademico.creditos_inscritos
          student.value.creditos_max_permitidos = perfilAcademico.creditos_max_permitidos
          student.value.estado_academico = perfilAcademico.estado_academico
          student.value.matricula_activa = perfilAcademico.matricula_activa
          student.value.nombre_completo = perfilAcademico.nombre_completo
          student.value.email_institucional = perfilAcademico.email_institucional

          Storage.setStudent(student.value)
        }
      } catch (perfilErr) {
        console.warn('⚠️ No se pudo cargar el perfil académico completo:', perfilErr)
      }

      return { requiresPasswordChange: response.requiresPasswordChange }
    } catch (err: unknown) {
      console.error('❌ Error en authStore.login:', err)
      const apiErr = err as { message?: string; statusCode?: number }

      if (apiErr?.statusCode === 500) {
        error.value = 'El servidor está presentando una falla temporal. Intenta nuevamente en unos minutos.'
      } else {
        error.value = apiErr?.message || 'Error al iniciar sesión.'
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function loginWithGoogle(idToken: string): Promise<{ requiresPasswordChange: boolean }> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.loginWithGoogle(idToken)

      token.value = response.token
      student.value = response.student
      Storage.setToken(response.token)
      Storage.setStudent(response.student)
      Storage.setFirstLogin(response.requiresPasswordChange)

      return { requiresPasswordChange: response.requiresPasswordChange }
    } catch (err: unknown) {
      const apiErr = err as { message?: string; statusCode?: number }
      error.value = apiErr?.message || 'No se pudo iniciar sesión con Google.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.changePassword(payload)
      token.value = response.token
      student.value = response.student
      Storage.setToken(response.token)
      Storage.setStudent(response.student)
      Storage.setFirstLogin(false)
      
      // 📚 Cargar perfil académico completo después de cambio de contraseña
      try {
        console.log('📚 Cargando perfil académico completo...')
        const perfilAcademico = await estudianteService.getPerfilAcademico()
        
        if (student.value) {
          student.value.semestre = perfilAcademico.semestre
          student.value.programa = perfilAcademico.programa || perfilAcademico.nombre_programa
          student.value.jornada = perfilAcademico.jornada
          student.value.creditos_inscritos = perfilAcademico.creditos_inscritos
          student.value.creditos_max_permitidos = perfilAcademico.creditos_max_permitidos
          student.value.estado_academico = perfilAcademico.estado_academico
          student.value.matricula_activa = perfilAcademico.matricula_activa
          student.value.nombre_completo = perfilAcademico.nombre_completo
          student.value.email_institucional = perfilAcademico.email_institucional
          
          Storage.setStudent(student.value)
        }
      } catch (perfilErr) {
        console.warn('⚠️ No se pudo cargar el perfil académico completo:', perfilErr)
      }
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message || 'Error al cambiar la contraseña.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    token.value = null
    student.value = null
    error.value = null
    Storage.clearAuth()
  }

  function clearError(): void {
    error.value = null
  }

  return { token, student, mockStudent, isLoading, error, isAuthenticated, studentFirstName, login, loginWithGoogle, changePassword, logout, clearError }
})
import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import type { ApiError } from '../types'

const DEFAULT_PROD_API_BASE_URL = 'https://proyecto-novedades-six.vercel.app/api'

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

function resolveApiBaseUrl(): string {
  const configuredBase = String(import.meta.env.VITE_API_BASE_URL || '').trim()
  const prodFallback = String(import.meta.env.VITE_API_PROD_BASE_URL || DEFAULT_PROD_API_BASE_URL).trim()
  const isAbsoluteHttp = (value: string): boolean => /^https?:\/\//i.test(value)

  // En desarrollo permitimos /api para aprovechar el proxy de Vite.
  if (import.meta.env.DEV) {
    return normalizeBaseUrl(configuredBase || '/api')
  }

  // En build/despliegue, evitar rutas relativas (/api) que apuntan al host del frontend.
  if (!configuredBase || configuredBase.startsWith('/')) {
    return normalizeBaseUrl(prodFallback)
  }

  if (isAbsoluteHttp(configuredBase)) {
    return normalizeBaseUrl(configuredBase)
  }

  return normalizeBaseUrl(prodFallback)
}

const apiBaseUrl = resolveApiBaseUrl()

console.info('[httpClient] API base URL resuelta:', apiBaseUrl)

const http: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

function redirectTo(path: string): void {
  window.location.hash = `#${path}`
}

function clearAuthStorage(): void {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_student')
  localStorage.removeItem('primer_login')
}

// Adjunta el token en cada request automáticamente
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * Extrae mensaje de error desde múltiples formatos posibles del backend
 */
function extraerMensajeError(backendData: any): string {
  return (
    backendData?.mensaje ||           // Formato del backend: { mensaje, ok, datos, codigo_estado }
    backendData?.message ||            // Formato alternativo: { message, ... }
    backendData?.error ||              // Formato alternativo: { error, ... }
    'Error en la solicitud'            // Fallback
  )
}

// Normaliza errores y maneja códigos especiales globalmente
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status
    const backendData = error.response?.data
    
    // Extraer mensaje del backend (soporta múltiples formatos)
    const message = extraerMensajeError(backendData)
    
    const apiError: ApiError = {
      message,
      statusCode: status,
      field: backendData?.field,
    }

    // HTTP 400 - Error de negocio (ErrorNegocio del backend)
    if (status === 400) {
      console.error('❌ Error de negocio (400):', message)
      return Promise.reject(apiError)
    }

    // HTTP 401 - Token ausente o inválido
    if (status === 401) {
      console.warn('⚠️ Token inválido o no proporcionado (401). Redirigiendo a login...')
      clearAuthStorage()
      redirectTo('/login')
      return Promise.reject(apiError)
    }

    // HTTP 403 - Prohibido (Tres casos posibles)
    if (status === 403) {
      // Caso 1: primer_login = true (contraseña temporal sin cambiar)
      if (message.includes('Debe cambiar su contraseña temporal')) {
        console.warn('⚠️ Token con primer_login=true. Redirigiendo a cambio de contraseña...')
        localStorage.setItem('primer_login', 'true')
        redirectTo('/cambiar-contrasena')
        return Promise.reject(apiError)
      }
      
      // Caso 2: Token expirado
      if (message.includes('expirado')) {
        console.warn('⚠️ Token expirado (403). Redirigiendo a login...')
        clearAuthStorage()
        redirectTo('/login')
        return Promise.reject(apiError)
      }
      
      // Caso 3: Sin permisos (rol insuficiente)
      console.error('❌ Acceso denegado por permisos insuficientes (403):', message)
      return Promise.reject(apiError)
    }

    // HTTP 423 - Cuenta bloqueada (ErrorAutenticacion)
    if (status === 423) {
      console.error('❌ Cuenta bloqueada (423):', message)
      clearAuthStorage()
      // Mostrar error pero no redirigir (el usuario verá el mensaje en la UI)
      return Promise.reject(apiError)
    }

    // HTTP 422 - Validación fallida (Zod - ErrorNegocio o validarEsquema)
    if (status === 422) {
      console.error('❌ Validación fallida (422):', message)
      apiError.message = message || 'Los datos enviados no son válidos'
      return Promise.reject(apiError)
    }

    // HTTP 500 - Error interno del servidor
    if (status === 500) {
      console.error('❌ Error interno del servidor (500):', message)
      return Promise.reject(apiError)
    }

    // Otros errores 4xx/5xx
    if (status && status >= 400) {
      console.error(`❌ Error HTTP ${status}:`, message)
    }

    // Errores de red / timeout
    if (!status) {
      console.error('❌ Error de conexión:', error.message)
      apiError.message = 'Error de conexión. Verifica tu conexión a internet.'
    }

    return Promise.reject(apiError)
  }
)

export default http
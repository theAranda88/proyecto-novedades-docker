import { ref } from 'vue'

export interface ErrorInfo {
  message: string
  code?: string | number
  timestamp: string
}

/**
 * Composable para manejo centralizado de errores
 * 
 * @example
 * ```ts
 * const { error, setError, clearError, handleApiError } = useErrorHandler()
 * 
 * try {
 *   await apiCall()
 * } catch (err) {
 *   handleApiError(err)
 * }
 * ```
 */
export function useErrorHandler() {
  const error = ref<ErrorInfo | null>(null)

  /**
   * Establece un error personalizado
   */
  function setError(message: string, code?: string | number): void {
    error.value = {
      message,
      code,
      timestamp: new Date().toISOString(),
    }
    
    // Log para debugging
    console.error(`[Error] ${message}`, { code, timestamp: error.value.timestamp })
  }

  /**
   * Limpia el error actual
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Maneja errores de API de forma centralizada
   */
  function handleApiError(err: unknown): ErrorInfo {
    let message = 'Error desconocido'
    let code: string | number | undefined

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'object' && err !== null) {
      const apiErr = err as Record<string, unknown>
      message = (apiErr.message as string) ?? message
      code = apiErr.statusCode as string | number | undefined
    }

    setError(message, code)
    return error.value!
  }

  /**
   * Maneja un error asincrónico y devuelve null en caso de error
   */
  async function tryAsync<T>(
    fn: () => Promise<T>,
    fallback?: T,
  ): Promise<T | null | undefined> {
    try {
      return await fn()
    } catch (err) {
      handleApiError(err)
      return fallback ?? null
    }
  }

  /**
   * Ejecuta una función con manejo de errores automático
   */
  function withErrorHandling<Args extends unknown[], R>(
    fn: (...args: Args) => Promise<R>,
  ): (...args: Args) => Promise<R | void> {
    return async (...args: Args) => {
      try {
        return await fn(...args)
      } catch (err) {
        handleApiError(err)
      }
    }
  }

  return {
    error,
    setError,
    clearError,
    handleApiError,
    tryAsync,
    withErrorHandling,
  }
}

export default useErrorHandler

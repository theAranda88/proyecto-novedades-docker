/**
 * Utility centralizado para manejo de localStorage
 * Proporciona una interfaz segura y tipada para acceso a almacenamiento local
 */

export const Storage = {
  /**
   * Almacena el token de autenticación
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Recupera el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  /**
   * Almacena información del estudiante
   */
  setStudent<T>(student: T): void {
    localStorage.setItem('auth_student', JSON.stringify(student))
  },

  /**
   * Recupera información del estudiante
   */
  getStudent<T = Record<string, unknown>>(): T | null {
    const data = localStorage.getItem('auth_student')
    if (!data) return null
    try {
      return JSON.parse(data) as T
    } catch {
      console.error('[Storage] Error parsing student data')
      return null
    }
  },

  /**
   * Marca si es el primer login y necesita cambio de contraseña
   */
  setFirstLogin(requiresChange: boolean): void {
    localStorage.setItem('primer_login', JSON.stringify(requiresChange))
  },

  /**
   * Obtiene el estado del primer login
   */
  getFirstLogin(): boolean {
    const value = localStorage.getItem('primer_login')
    return value ? JSON.parse(value) : false
  },

  /**
   * Limpia toda la información de autenticación
   */
  clearAuth(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_student')
    localStorage.removeItem('primer_login')
  },

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    localStorage.clear()
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

export default Storage

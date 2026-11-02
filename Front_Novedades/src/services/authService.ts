import http from '../utils/httpClient'
import type { ApiResponse, LoginPayload, LoginResponse, ChangePasswordPayload, ChangePasswordResponse } from '../types'

const authService = {
async login(payload: LoginPayload): Promise<LoginResponse> {
const { data } = await http.post<ApiResponse<LoginResponse>>('/auth/login', {
  correo: payload.correo.trim().toLowerCase(),
  password: payload.password,
})
return data.datos
},

async loginWithGoogle(idToken: string): Promise<LoginResponse> {
  const { data } = await http.post<ApiResponse<LoginResponse>>('/auth/google', {
    id_token: idToken,
  })
  return data.datos
},

async changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
const { data } = await http.post<ApiResponse<ChangePasswordResponse>>('/auth/change-password', payload)
return data.datos
},

logout(): void {
localStorage.removeItem('auth_token')
localStorage.removeItem('auth_student')
},

isAuthenticated(): boolean {
return !!localStorage.getItem('auth_token')
},
}

export default authService
import type { Plan } from "@/modules/billing/plans/types/plans.types"
import type { User } from "@/modules/users/types/users.types"
import http from "@/services/http"
import axios from "axios"

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  features: string[]
  limits: Record<string, number>
  plan: Plan | null
  user: User
  roles?: User['roles']
  permissions?: string[]
  permission_codes?: string[]
  refresh_token?: string
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await http.post<LoginResponse>('/sign-in', credentials)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejar errores específicos del backend
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas')
      }
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
    }
    throw error
  }
}
import axios from "axios"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./storage"
import { useAuthStore } from "@/app/store/auth.store"
import { canAuthorizeApiRequest } from "./authorization"
import { isDemoMode } from "./appMode"
import { demoAdapter } from "./mock/demoApi"

const http = axios.create({
  baseURL: isDemoMode() ? 'demo://optica' : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: isDemoMode() ? demoAdapter : undefined,
})

// Interceptor para agregar token + prevalidación RBAC del cliente
http.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      if (!canAuthorizeApiRequest(config.url, (config.method || "GET").toUpperCase())) {
        const error = new Error("No tienes permisos para realizar esta acción.")
        ;(error as Error & { code?: string }).code = "FRONTEND_PERMISSION_DENIED"
        return Promise.reject(error)
      }
    } else {
      console.warn('No hay token disponible para la solicitud:', config.url)
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar refresh token
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (isDemoMode()) return Promise.reject(error)

    // Si es error 401 y no hemos intentado refresh aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh: refreshToken }
        )

        const { access, refresh } = response.data
        setTokens({ access, refresh })

        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${access}`
        return http(originalRequest)
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        clearTokens()
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default http
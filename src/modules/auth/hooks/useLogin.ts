import { useMutation } from "@tanstack/react-query"
import { login } from "../api/login.api"
import { useAuthStore } from "@/app/store/auth.store"
import { useNavigate } from "react-router-dom"
import { notification } from "@/services/notification"

export const useLogin = () => {
  const loginStore = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data)
      
      // Guardar usuario, tokens y datos adicionales
      loginStore(
        data.user,
        {
          access: data.access_token,
          refresh: data.refresh_token
        },
        {
          features: data.features || [],
          limits: data.limits || {},
          plan: data.plan || null,
          permissions: data.permissions || data.permission_codes || [],
          roles: data.roles || data.user.roles || []
        }
      )
      
      notification.success(`Bienvenido ${data.user.username}`)
      navigate('/')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Error al iniciar sesión"
      notification.error(message)
      console.error('Login error:', error)
    },
  })
}
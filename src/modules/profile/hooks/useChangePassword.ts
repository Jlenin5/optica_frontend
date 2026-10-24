import { useMutation } from "@tanstack/react-query"
import { changePassword } from "../api/profile.api"
import type { ChangePasswordDTO } from "../types/profile.types"
import { notification } from "@/services/notification"

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDTO) => changePassword(data),
    onSuccess: () => {
      notification.success("Contraseña actualizada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar la contraseña"
      notification.error(message)
      console.error("Error changing password:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../api/profile.api"
import type { UpdateProfileDTO } from "../types/profile.types"
import { notification } from "@/services/notification"
import { useAuthStore } from "@/app/store/auth.store"

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: UpdateProfileDTO) => updateProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      setUser(data)
      notification.success("Perfil actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el perfil"
      notification.error(message)
      console.error("Error updating profile:", error)
    },
  })
}
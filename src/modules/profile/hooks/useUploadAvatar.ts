import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadAvatar } from "../api/profile.api"
import { notification } from "@/services/notification"
import { useAuthStore } from "@/app/store/auth.store"

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      // Actualizar el avatar en el store
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        setUser({ ...currentUser, avatar: data.avatar })
      }
      notification.success("Avatar actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al subir el avatar"
      notification.error(message)
      console.error("Error uploading avatar:", error)
    },
  })
}
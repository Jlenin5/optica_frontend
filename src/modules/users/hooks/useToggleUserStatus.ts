import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleUserStatus } from "../api/users.api"
import { notification } from "@/services/notification"

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleUserStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", data.id] })
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Usuario ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del usuario"
      notification.error(message)
      console.error("Error toggling user status:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBrandStatus } from "../api/brands.api"
import { notification } from "@/services/notification"

export const useToggleBrandStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleBrandStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", data.id] })
      queryClient.invalidateQueries({ queryKey: ["brands", "stats"] })
      const statusText = data.status ? "activada" : "desactivada"
      notification.success(`Marca ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado de la marca"
      notification.error(message)
      console.error("Error toggling brand status:", error)
    },
  })
}
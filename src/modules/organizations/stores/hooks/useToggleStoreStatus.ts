import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleStoreStatus } from "../api/stores.api"
import { notification } from "@/services/notification"

export const useToggleStoreStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleStoreStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores", "stats"] })
      const statusText = data.status ? "activada" : "desactivada"
      notification.success(`Tienda ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado de la tienda"
      notification.error(message)
      console.error("Error toggling store status:", error)
    },
  })
}
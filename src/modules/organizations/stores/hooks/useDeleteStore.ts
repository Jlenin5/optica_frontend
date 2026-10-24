import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteStore } from "../api/stores.api"
import { notification } from "@/services/notification"

export const useDeleteStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores", "stats"] })
      notification.success("Tienda eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la tienda"
      notification.error(message)
      console.error("Error deleting store:", error)
    },
  })
}
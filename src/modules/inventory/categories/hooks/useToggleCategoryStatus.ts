import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleCategoryStatus } from "../api/categories.api"
import { notification } from "@/services/notification"

export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleCategoryStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", data.id] })
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] })
      const statusText = data.status ? "activada" : "desactivada"
      notification.success(`Categoría ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado de la categoría"
      notification.error(message)
      console.error("Error toggling category status:", error)
    },
  })
}
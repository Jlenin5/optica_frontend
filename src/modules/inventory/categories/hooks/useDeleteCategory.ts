import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCategory } from "../api/categories.api"
import { notification } from "@/services/notification"

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] })
      notification.success("Categoría eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la categoría"
      notification.error(message)
      console.error("Error deleting category:", error)
    },
  })
}
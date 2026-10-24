import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBrand } from "../api/brands.api"
import { notification } from "@/services/notification"

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", "stats"] })
      notification.success("Marca eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la marca"
      notification.error(message)
      console.error("Error deleting brand:", error)
    },
  })
}
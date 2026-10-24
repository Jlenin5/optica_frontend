import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFeature } from "../api/features.api"
import { notification } from "@/services/notification"

export const useDeleteFeature = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] })
      notification.success("Característica eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la característica"
      notification.error(message)
      console.error("Error deleting feature:", error)
    },
  })
}
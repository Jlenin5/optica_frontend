import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteLimit } from "../api/limits.api"
import { notification } from "@/services/notification"

export const useDeleteLimit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limits"] })
      notification.success("Límite eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el límite"
      notification.error(message)
      console.error("Error deleting limit:", error)
    },
  })
}
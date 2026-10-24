import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTax } from "../api/taxes.api"
import { notification } from "@/services/notification"

export const useDeleteTax = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTax(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] })
      queryClient.invalidateQueries({ queryKey: ["taxes", "stats"] })
      notification.success("Impuesto eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el impuesto"
      notification.error(message)
      console.error("Error deleting tax:", error)
    },
  })
}
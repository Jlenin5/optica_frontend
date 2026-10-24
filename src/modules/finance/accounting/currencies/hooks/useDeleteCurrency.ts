import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCurrency } from "../api/currencies.api"
import { notification } from "@/services/notification"

export const useDeleteCurrency = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
      queryClient.invalidateQueries({ queryKey: ["currencies", "stats"] })
      notification.success("Moneda eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la moneda"
      notification.error(message)
      console.error("Error deleting currency:", error)
    },
  })
}
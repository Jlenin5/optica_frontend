import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCashRegister } from "../api/cash-registers.api"
import { notification } from "@/services/notification"

export const useDeleteCashRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCashRegister(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "stats"] })
      notification.success("Caja eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la caja"
      notification.error(message)
      console.error("Error deleting cash register:", error)
    },
  })
}
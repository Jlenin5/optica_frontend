import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCashMovement } from "../api/cash-movements.api"
import { notification } from "@/services/notification"

export const useDeleteCashMovement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCashMovement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-movements"] })
      queryClient.invalidateQueries({ queryKey: ["cash-movements", "stats"] })
      notification.success("Movimiento eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el movimiento"
      notification.error(message)
      console.error("Error deleting cash movement:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCashMovement } from "../api/cash-movements.api"
import type { UpdateCashMovementDTO } from "../types/cash-movements.types"
import { notification } from "@/services/notification"

export const useUpdateCashMovement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCashMovementDTO }) => 
      updateCashMovement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-movements"] })
      queryClient.invalidateQueries({ queryKey: ["cash-movements", "stats"] })
      notification.success("Movimiento actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el movimiento"
      notification.error(message)
      console.error("Error updating cash movement:", error)
    },
  })
}
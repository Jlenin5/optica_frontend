import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCashMovement } from "../api/cash-movements.api"
import type { CreateCashMovementDTO } from "../types/cash-movements.types"
import { notification } from "@/services/notification"

export const useCreateCashMovement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCashMovementDTO) => createCashMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-movements"] })
      queryClient.invalidateQueries({ queryKey: ["cash-movements", "stats"] })
      notification.success("Movimiento de caja registrado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el movimiento"
      notification.error(message)
      console.error("Error creating cash movement:", error)
    },
  })
}
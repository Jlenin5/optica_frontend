import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCashRegister } from "../api/cash-registers.api"
import type { UpdateCashRegisterDTO } from "../types/cash-registers.types"
import { notification } from "@/services/notification"

export const useUpdateCashRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCashRegisterDTO }) => 
      updateCashRegister(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "stats"] })
      notification.success("Caja actualizada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la caja"
      notification.error(message)
      console.error("Error updating cash register:", error)
    },
  })
}
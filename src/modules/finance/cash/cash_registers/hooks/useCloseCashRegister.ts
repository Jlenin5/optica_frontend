import { useMutation, useQueryClient } from "@tanstack/react-query"
import { closeCashRegister } from "../api/cash-registers.api"
import type { CloseCashRegisterDTO } from "../types/cash-registers.types"
import { notification } from "@/services/notification"

export const useCloseCashRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CloseCashRegisterDTO }) => 
      closeCashRegister(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", data.id] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "active"] })
      notification.success("Caja cerrada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cerrar la caja"
      notification.error(message)
      console.error("Error closing cash register:", error)
    },
  })
}
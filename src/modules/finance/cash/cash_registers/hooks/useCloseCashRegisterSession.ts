import { useMutation, useQueryClient } from "@tanstack/react-query"
import { closeCashRegisterSession } from "../api/cash-registers.api"
import type { CloseCashRegisterDTO } from "../types/cash-registers.types"
import { notification } from "@/services/notification"

export const useCloseCashRegisterSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CloseCashRegisterDTO }) => 
      closeCashRegisterSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-register-sessions"] })
      queryClient.invalidateQueries({ queryKey: ["cash-register-sessions", "active"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "stats"] })
      notification.success("Caja cerrada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cerrar la caja"
      notification.error(message)
      console.error("Error closing cash register:", error)
    },
  })
}
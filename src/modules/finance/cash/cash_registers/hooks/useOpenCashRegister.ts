import { useMutation, useQueryClient } from "@tanstack/react-query"
import { openCashRegister } from "../api/cash-registers.api"
import type { OpenCashRegisterDTO } from "../types/cash-registers.types"
import { notification } from "@/services/notification"

export const useOpenCashRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: OpenCashRegisterDTO) => openCashRegister(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cash-register-sessions"] })
      queryClient.invalidateQueries({ queryKey: ["cash-register-sessions", "active"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "stats"] })
      notification.success(`Caja "${data.cash_register_id}" abierta exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al abrir la caja"
      notification.error(message)
      console.error("Error opening cash register:", error)
    },
  })
}
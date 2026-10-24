import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCashRegister } from "../api/cash-registers.api"
import type { CreateCashRegisterDTO } from "../types/cash-registers.types"
import { notification } from "@/services/notification"

export const useCreateCashRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCashRegisterDTO) => createCashRegister(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] })
      queryClient.invalidateQueries({ queryKey: ["cash-registers", "stats"] })
      notification.success(`Caja "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la caja"
      notification.error(message)
      console.error("Error creating cash register:", error)
    },
  })
}
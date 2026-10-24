import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateExchangeRate } from "../api/exchange-rates.api"
import type { UpdateExchangeRateDTO } from "../types/exchange-rates.types"
import { notification } from "@/services/notification"

export const useUpdateExchangeRate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExchangeRateDTO }) => 
      updateExchangeRate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] })
      queryClient.invalidateQueries({ queryKey: ["exchange-rates", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["exchange-rates", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["exchange-rates", "latest"] })
      notification.success("Tasa de cambio actualizada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la tasa de cambio"
      notification.error(message)
      console.error("Error updating exchange rate:", error)
    },
  })
}
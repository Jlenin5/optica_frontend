import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createExchangeRate } from "../api/exchange-rates.api"
import type { CreateExchangeRateDTO } from "../types/exchange-rates.types"
import { notification } from "@/services/notification"

export const useCreateExchangeRate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExchangeRateDTO) => createExchangeRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] })
      queryClient.invalidateQueries({ queryKey: ["exchange-rates", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["exchange-rates", "latest"] })
      notification.success("Tasa de cambio creada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la tasa de cambio"
      notification.error(message)
      console.error("Error creating exchange rate:", error)
    },
  })
}
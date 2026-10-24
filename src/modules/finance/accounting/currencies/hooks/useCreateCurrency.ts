import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCurrency } from "../api/currencies.api"
import type { CreateCurrencyDTO } from "../types/currencies.types"
import { notification } from "@/services/notification"

export const useCreateCurrency = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCurrencyDTO) => createCurrency(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
      queryClient.invalidateQueries({ queryKey: ["currencies", "stats"] })
      notification.success(`Moneda "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la moneda"
      notification.error(message)
      console.error("Error creating currency:", error)
    },
  })
}
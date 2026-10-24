import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCurrency } from "../api/currencies.api"
import type { UpdateCurrencyDTO } from "../types/currencies.types"
import { notification } from "@/services/notification"

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCurrencyDTO }) => 
      updateCurrency(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
      queryClient.invalidateQueries({ queryKey: ["currencies", data.id] })
      queryClient.invalidateQueries({ queryKey: ["currencies", "stats"] })
      notification.success(`Moneda "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la moneda"
      notification.error(message)
      console.error("Error updating currency:", error)
    },
  })
}
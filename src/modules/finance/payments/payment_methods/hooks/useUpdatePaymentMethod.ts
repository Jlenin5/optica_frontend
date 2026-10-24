import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePaymentMethod } from "../api/payment-methods.api"
import type { UpdatePaymentMethodDTO } from "../types/payment-methods.types"
import { notification } from "@/services/notification"

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodDTO }) => 
      updatePaymentMethod(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      queryClient.invalidateQueries({ queryKey: ["payment-methods", data.id] })
      queryClient.invalidateQueries({ queryKey: ["payment-methods", "stats"] })
      notification.success("Método de pago actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el método de pago"
      notification.error(message)
      console.error("Error updating payment method:", error)
    },
  })
}
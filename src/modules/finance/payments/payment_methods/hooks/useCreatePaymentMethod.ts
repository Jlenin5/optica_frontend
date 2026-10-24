import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPaymentMethod } from "../api/payment-methods.api"
import type { CreatePaymentMethodDTO } from "../types/payment-methods.types"
import { notification } from "@/services/notification"

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePaymentMethodDTO) => createPaymentMethod(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      queryClient.invalidateQueries({ queryKey: ["payment-methods", "stats"] })
      notification.success(`Método de pago "${data.description}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el método de pago"
      notification.error(message)
      console.error("Error creating payment method:", error)
    },
  })
}
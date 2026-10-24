import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPaymentType } from "../api/payment-types.api"
import type { CreatePaymentTypeDTO } from "../types/payment-types.types"
import { notification } from "@/services/notification"

export const useCreatePaymentType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePaymentTypeDTO) => createPaymentType(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payment-types"] })
      queryClient.invalidateQueries({ queryKey: ["payment-types", "stats"] })
      notification.success(`Tipo de pago "${data.description}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el tipo de pago"
      notification.error(message)
      console.error("Error creating payment type:", error)
    },
  })
}
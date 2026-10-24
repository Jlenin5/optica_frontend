import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePaymentType } from "../api/payment-types.api"
import type { UpdatePaymentTypeDTO } from "../types/payment-types.types"
import { notification } from "@/services/notification"

export const useUpdatePaymentType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentTypeDTO }) => 
      updatePaymentType(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payment-types"] })
      queryClient.invalidateQueries({ queryKey: ["payment-types", data.id] })
      queryClient.invalidateQueries({ queryKey: ["payment-types", "stats"] })
      notification.success("Tipo de pago actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el tipo de pago"
      notification.error(message)
      console.error("Error updating payment type:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePaymentMethod } from "../api/payment-methods.api"
import { notification } from "@/services/notification"

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      queryClient.invalidateQueries({ queryKey: ["payment-methods", "stats"] })
      notification.success("Método de pago eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el método de pago"
      notification.error(message)
      console.error("Error deleting payment method:", error)
    },
  })
}
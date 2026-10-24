import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePaymentType } from "../api/payment-types.api"
import { notification } from "@/services/notification"

export const useDeletePaymentType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePaymentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-types"] })
      queryClient.invalidateQueries({ queryKey: ["payment-types", "stats"] })
      notification.success("Tipo de pago eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el tipo de pago"
      notification.error(message)
      console.error("Error deleting payment type:", error)
    },
  })
}
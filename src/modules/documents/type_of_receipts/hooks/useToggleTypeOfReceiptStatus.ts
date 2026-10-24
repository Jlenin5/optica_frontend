import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleTypeOfReceiptStatus } from "../api/type-of-receipts.api"
import { notification } from "@/services/notification"

export const useToggleTypeOfReceiptStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleTypeOfReceiptStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts"] })
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Tipo de recibo ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del tipo de recibo"
      notification.error(message)
      console.error("Error toggling type of receipt status:", error)
    },
  })
}
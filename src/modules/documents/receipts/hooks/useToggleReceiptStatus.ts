import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleReceiptStatus } from "../api/receipts.api"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useToggleReceiptStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleReceiptStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] })
      queryClient.invalidateQueries({ queryKey: ["receipts", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Recibo ${statusText} exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del recibo"
      notification.error(message)
      console.error("Error toggling receipt status:", error)
    },
  })
}
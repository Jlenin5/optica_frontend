import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateReceipt } from "../api/receipts.api"
import type { UpdateReceiptDTO } from "../types/receipts.types"
import { notification } from "@/services/notification"

export const useUpdateReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReceiptDTO }) => 
      updateReceipt(id, data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] })
      queryClient.invalidateQueries({ queryKey: ["receipts", "stats"] })
      notification.success("Recibo actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el recibo"
      notification.error(message)
      console.error("Error updating receipt:", error)
    },
  })
}
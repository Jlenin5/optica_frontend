import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTypeOfReceipt } from "../api/type-of-receipts.api"
import type { UpdateTypeOfReceiptDTO } from "../types/type-of-receipts.types"
import { notification } from "@/services/notification"

export const useUpdateTypeOfReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTypeOfReceiptDTO }) => 
      updateTypeOfReceipt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts"] })
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts", "stats"] })
      notification.success("Tipo de recibo actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el tipo de recibo"
      notification.error(message)
      console.error("Error updating type of receipt:", error)
    },
  })
}
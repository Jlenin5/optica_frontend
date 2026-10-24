import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createReceipt } from "../api/receipts.api"
import type { CreateReceiptDTO } from "../types/receipts.types"
import { notification } from "@/services/notification"

export const useCreateReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReceiptDTO) => createReceipt(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] })
      queryClient.invalidateQueries({ queryKey: ["receipts", "stats"] })
      notification.success(`Recibo "${data.description.substring(0, 50)}..." creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el recibo"
      notification.error(message)
      console.error("Error creating receipt:", error)
    },
  })
}
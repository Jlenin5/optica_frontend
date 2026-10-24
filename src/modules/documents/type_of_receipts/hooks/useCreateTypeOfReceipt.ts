import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTypeOfReceipt } from "../api/type-of-receipts.api"
import type { CreateTypeOfReceiptDTO } from "../types/type-of-receipts.types"
import { notification } from "@/services/notification"

export const useCreateTypeOfReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTypeOfReceiptDTO) => createTypeOfReceipt(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts"] })
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts", "stats"] })
      const description = data.description || `Serie: ${data.serie} - Correlativo: ${data.correlative}`
      notification.success(`Tipo de recibo "${description}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el tipo de recibo"
      notification.error(message)
      console.error("Error creating type of receipt:", error)
    },
  })
}
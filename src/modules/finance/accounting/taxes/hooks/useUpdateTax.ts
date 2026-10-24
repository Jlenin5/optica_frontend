import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTax } from "../api/taxes.api"
import type { UpdateTaxDTO } from "../types/taxes.types"
import { notification } from "@/services/notification"

export const useUpdateTax = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaxDTO }) => 
      updateTax(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] })
      queryClient.invalidateQueries({ queryKey: ["taxes", data.id] })
      queryClient.invalidateQueries({ queryKey: ["taxes", "stats"] })
      notification.success(`Impuesto "${data.code}" actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el impuesto"
      notification.error(message)
      console.error("Error updating tax:", error)
    },
  })
}
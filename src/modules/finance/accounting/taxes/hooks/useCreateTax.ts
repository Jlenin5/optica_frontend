import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTax } from "../api/taxes.api"
import type { CreateTaxDTO } from "../types/taxes.types"
import { notification } from "@/services/notification"

export const useCreateTax = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaxDTO) => createTax(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] })
      queryClient.invalidateQueries({ queryKey: ["taxes", "stats"] })
      notification.success(`Impuesto "${data.code}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el impuesto"
      notification.error(message)
      console.error("Error creating tax:", error)
    },
  })
}
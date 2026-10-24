import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBank } from "../api/banks.api"
import type { CreateBankDTO } from "../types/banks.types"
import { notification } from "@/services/notification"

export const useCreateBank = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBankDTO) => createBank(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["banks"] })
      queryClient.invalidateQueries({ queryKey: ["banks", "stats"] })
      notification.success(`Banco "${data.name}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el banco"
      notification.error(message)
      console.error("Error creating bank:", error)
    },
  })
}
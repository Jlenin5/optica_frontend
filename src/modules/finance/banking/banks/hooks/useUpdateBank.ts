import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBank } from "../api/banks.api"
import type { UpdateBankDTO } from "../types/banks.types"
import { notification } from "@/services/notification"

export const useUpdateBank = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBankDTO }) => 
      updateBank(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["banks"] })
      queryClient.invalidateQueries({ queryKey: ["banks", data.id] })
      queryClient.invalidateQueries({ queryKey: ["banks", "stats"] })
      notification.success(`Banco "${data.name}" actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el banco"
      notification.error(message)
      console.error("Error updating bank:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBankAccount } from "../api/bank-accounts.api"
import type { UpdateBankAccountDTO } from "../types/bank-accounts.types"
import { notification } from "@/services/notification"

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBankAccountDTO }) => 
      updateBankAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts", "stats"] })
      notification.success("Cuenta bancaria actualizada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la cuenta bancaria"
      notification.error(message)
      console.error("Error updating bank account:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBankAccount } from "../api/bank-accounts.api"
import type { CreateBankAccountDTO } from "../types/bank-accounts.types"
import { notification } from "@/services/notification"

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBankAccountDTO) => createBankAccount(data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts", "stats"] })
      notification.success(`Cuenta bancaria creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la cuenta bancaria"
      notification.error(message)
      console.error("Error creating bank account:", error)
    },
  })
}
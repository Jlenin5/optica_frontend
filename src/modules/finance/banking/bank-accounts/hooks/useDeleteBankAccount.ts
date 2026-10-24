import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBankAccount } from "../api/bank-accounts.api"
import { notification } from "@/services/notification"

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts", "stats"] })
      notification.success("Cuenta bancaria eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la cuenta bancaria"
      notification.error(message)
      console.error("Error deleting bank account:", error)
    },
  })
}
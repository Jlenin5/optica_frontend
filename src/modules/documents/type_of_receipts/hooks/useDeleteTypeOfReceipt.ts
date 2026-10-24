import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTypeOfReceipt } from "../api/type-of-receipts.api"
import { notification } from "@/services/notification"

export const useDeleteTypeOfReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTypeOfReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts"] })
      queryClient.invalidateQueries({ queryKey: ["type-of-receipts", "stats"] })
      notification.success("Tipo de recibo eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el tipo de recibo"
      notification.error(message)
      console.error("Error deleting type of receipt:", error)
    },
  })
}
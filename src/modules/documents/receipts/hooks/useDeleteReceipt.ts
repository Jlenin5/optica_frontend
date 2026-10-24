import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteReceipt } from "../api/receipts.api"
import { notification } from "@/services/notification"

export const useDeleteReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] })
      queryClient.invalidateQueries({ queryKey: ["receipts", "stats"] })
      notification.success("Recibo eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el recibo"
      notification.error(message)
      console.error("Error deleting receipt:", error)
    },
  })
}
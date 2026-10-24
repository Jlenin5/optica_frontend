import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBank } from "../api/banks.api"
import { notification } from "@/services/notification"

export const useDeleteBank = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] })
      queryClient.invalidateQueries({ queryKey: ["banks", "stats"] })
      notification.success("Banco eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el banco"
      notification.error(message)
      console.error("Error deleting bank:", error)
    },
  })
}
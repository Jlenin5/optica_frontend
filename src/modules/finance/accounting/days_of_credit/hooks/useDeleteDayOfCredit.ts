import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDayOfCredit } from "../api/days-of-credit.api"
import { notification } from "@/services/notification"

export const useDeleteDayOfCredit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteDayOfCredit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["days-of-credit"] })
      queryClient.invalidateQueries({ queryKey: ["days-of-credit", "stats"] })
      notification.success("Día de crédito eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el día de crédito"
      notification.error(message)
      console.error("Error deleting day of credit:", error)
    },
  })
}
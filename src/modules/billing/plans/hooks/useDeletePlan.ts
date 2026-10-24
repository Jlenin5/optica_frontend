import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePlan } from "../api/plans.api"
import { notification } from "@/services/notification"

export const useDeletePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plans", "stats"] })
      notification.success("Plan eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el plan"
      notification.error(message)
      console.error("Error deleting plan:", error)
    },
  })
}
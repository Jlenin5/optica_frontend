import { useMutation, useQueryClient } from "@tanstack/react-query"
import { togglePlanStatus } from "../api/plans.api"
import { notification } from "@/services/notification"

export const useTogglePlanStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      togglePlanStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plans", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Plan ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del plan"
      notification.error(message)
      console.error("Error toggling plan status:", error)
    },
  })
}
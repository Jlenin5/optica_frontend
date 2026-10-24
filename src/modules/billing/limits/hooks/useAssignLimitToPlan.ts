import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignLimitToPlan } from "../api/limits.api"
import { notification } from "@/services/notification"

export const useAssignLimitToPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignLimitToPlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-limits", variables.plan_id] })
      notification.success("Límite asignado al plan exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al asignar límite al plan"
      notification.error(message)
      console.error("Error assigning limit to plan:", error)
    },
  })
}
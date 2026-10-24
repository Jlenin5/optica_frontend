import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignFeatureToPlan } from "../api/features.api"
import { notification } from "@/services/notification"

export const useAssignFeatureToPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignFeatureToPlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-features", variables.plan_id] })
      notification.success("Característica asignada al plan exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al asignar característica al plan"
      notification.error(message)
      console.error("Error assigning feature to plan:", error)
    },
  })
}
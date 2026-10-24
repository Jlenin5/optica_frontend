import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeFeatureFromPlan } from "../api/features.api"
import { notification } from "@/services/notification"

export const useRemoveFeatureFromPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removeFeatureFromPlan(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["plan-features"] })
      notification.success("Característica removida del plan exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al remover característica del plan"
      notification.error(message)
      console.error("Error removing feature from plan:", error)
    },
  })
}
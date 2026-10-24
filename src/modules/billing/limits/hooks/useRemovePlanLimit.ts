import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removePlanLimit } from "../api/limits.api"
import { notification } from "@/services/notification"

export const useRemovePlanLimit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removePlanLimit(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["plan-limits"] })
      notification.success("Límite removido del plan exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al remover límite del plan"
      notification.error(message)
      console.error("Error removing plan limit:", error)
    },
  })
}
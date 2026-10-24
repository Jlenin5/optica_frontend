import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePlan } from "../api/plans.api"
import type { Plan } from "../types/plans.types"
import { notification } from "@/services/notification"

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Plan }) => 
      updatePlan(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plans", "stats"] })
      notification.success(`Plan "${data.name}" actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el plan"
      notification.error(message)
      console.error("Error updating plan:", error)
    },
  })
}
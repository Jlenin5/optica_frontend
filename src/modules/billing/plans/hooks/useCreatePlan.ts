import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPlan } from "../api/plans.api"
import type { Plan } from "../types/plans.types"
import { notification } from "@/services/notification"

export const useCreatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Plan) => createPlan(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plans", "stats"] })
      notification.success(`Plan "${data.name}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el plan"
      notification.error(message)
      console.error("Error creating plan:", error)
    },
  })
}
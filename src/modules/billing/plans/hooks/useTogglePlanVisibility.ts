import { useMutation, useQueryClient } from "@tanstack/react-query"
import { togglePlanVisibility } from "../api/plans.api"
import { notification } from "@/services/notification"

export const useTogglePlanVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, is_public }: { id: number; is_public: boolean }) => 
      togglePlanVisibility(id, is_public),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plans", "stats"] })
      const visibilityText = data.is_public ? "público" : "privado"
      notification.success(`Plan ahora es ${visibilityText}`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar la visibilidad del plan"
      notification.error(message)
      console.error("Error toggling plan visibility:", error)
    },
  })
}
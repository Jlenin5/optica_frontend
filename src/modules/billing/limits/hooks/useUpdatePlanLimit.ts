import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePlanLimit } from "../api/limits.api"
import { notification } from "@/services/notification"

export const useUpdatePlanLimit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, value }: { id: number; value: number | null }) => 
      updatePlanLimit(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-limits"] })
      notification.success("Valor del límite actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el valor del límite"
      notification.error(message)
      console.error("Error updating plan limit:", error)
    },
  })
}
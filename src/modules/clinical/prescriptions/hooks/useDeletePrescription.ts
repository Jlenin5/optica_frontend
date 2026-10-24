import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePrescription } from "../api/prescriptions.api"
import { notification } from "@/services/notification"

export const useDeletePrescription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] })
      queryClient.invalidateQueries({ queryKey: ["prescriptions", "stats"] })
      notification.success("Prescripción eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la prescripción"
      notification.error(message)
      console.error("Error deleting prescription:", error)
    },
  })
}
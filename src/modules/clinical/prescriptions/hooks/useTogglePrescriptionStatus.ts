import { useMutation, useQueryClient } from "@tanstack/react-query"
import { togglePrescriptionStatus } from "../api/prescriptions.api"
import { notification } from "@/services/notification"

export const useTogglePrescriptionStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      togglePrescriptionStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] })
      queryClient.invalidateQueries({ queryKey: ["prescriptions", data.id] })
      queryClient.invalidateQueries({ queryKey: ["prescriptions", "stats"] })
      const statusText = data.status ? "activada" : "desactivada"
      notification.success(`Prescripción ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado de la prescripción"
      notification.error(message)
      console.error("Error toggling prescription status:", error)
    },
  })
}
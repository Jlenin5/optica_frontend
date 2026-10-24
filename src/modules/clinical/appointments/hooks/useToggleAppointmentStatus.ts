import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleAppointmentStatus } from "../api/appointments.api"
import { notification } from "@/services/notification"

export const useToggleAppointmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleAppointmentStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "calendar"] })
      const statusText = data.status ? "activada" : "cancelada"
      notification.success(`Cita ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado de la cita"
      notification.error(message)
      console.error("Error toggling appointment status:", error)
    },
  })
}
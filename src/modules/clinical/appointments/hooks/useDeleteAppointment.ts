import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAppointment } from "../api/appointments.api"
import { notification } from "@/services/notification"

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "calendar"] })
      notification.success("Cita eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la cita"
      notification.error(message)
      console.error("Error deleting appointment:", error)
    },
  })
}
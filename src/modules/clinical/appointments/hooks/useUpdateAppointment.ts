import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAppointment } from "../api/appointments.api"
import type { UpdateAppointmentDTO } from "../types/appointments.types"
import { notification } from "@/services/notification"

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentDTO }) => 
      updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "calendar"] })
      notification.success(`Cita actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la cita"
      notification.error(message)
      console.error("Error updating appointment:", error)
    },
  })
}
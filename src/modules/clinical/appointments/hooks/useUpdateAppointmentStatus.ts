import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAppointment } from "../api/appointments.api"
import type { UpdateAppointmentDTO, AppointmentStatus } from "../types/appointments.types"
import { notification } from "@/services/notification"

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) => 
      updateAppointment(id, { status } as UpdateAppointmentDTO),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "calendar"] })
      
      const statusMessages: Record<AppointmentStatus, string> = {
        scheduled: 'agendada',
        confirmed: 'confirmada',
        in_progress: 'en progreso',
        completed: 'completada',
        cancelled: 'cancelada',
        no_show: 'marcada como no asistió'
      }
      
      notification.success(`Cita ${statusMessages[data.status]} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el estado de la cita"
      notification.error(message)
      console.error("Error updating appointment status:", error)
    },
  })
}
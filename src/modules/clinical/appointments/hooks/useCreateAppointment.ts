import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAppointment } from "../api/appointments.api"
import type { CreateAppointmentDTO } from "../types/appointments.types"
import { notification } from "@/services/notification"

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentDTO) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["appointments", "calendar"] })
      notification.success(`Cita agendada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al agendar la cita"
      notification.error(message)
      console.error("Error creating appointment:", error)
    },
  })
}
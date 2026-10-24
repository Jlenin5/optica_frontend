import { useMutation, useQueryClient } from "@tanstack/react-query"
import { linkConsultationToAppointment } from "../api/appointments.api"
import { notification } from "@/services/notification"

export const useLinkConsultationToAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ appointmentId, consultationId }: { appointmentId: number; consultationId: number }) =>
      linkConsultationToAppointment(appointmentId, consultationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      notification.success("Consulta asociada a la cita exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al asociar la consulta"
      notification.error(message)
      console.error("Error linking consultation:", error)
    },
  })
}

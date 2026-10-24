import { useMutation, useQueryClient } from "@tanstack/react-query"
import { togglePatientStatus } from "../api/patients.api"
import { notification } from "@/services/notification"

export const useTogglePatientStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      togglePatientStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patients", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Paciente ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del paciente"
      notification.error(message)
      console.error("Error toggling patient status:", error)
    },
  })
}
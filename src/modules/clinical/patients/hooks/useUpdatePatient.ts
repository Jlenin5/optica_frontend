import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePatient } from "../api/patients.api"
import type { UpdatePatientDTO } from "../types/patients.types"
import { notification } from "@/services/notification"

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePatientDTO }) => 
      updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patients", "stats"] })
      notification.success(`Paciente actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el paciente"
      notification.error(message)
      console.error("Error updating patient:", error)
    },
  })
}
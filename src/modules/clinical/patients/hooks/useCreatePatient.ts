import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPatient } from "../api/patients.api"
import type { CreatePatientDTO } from "../types/patients.types"
import { notification } from "@/services/notification"

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePatientDTO) => createPatient(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patients", "stats"] })
      notification.success(`Paciente ${data.first_name} ${data.last_name} creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el paciente"
      notification.error(message)
      console.error("Error creating patient:", error)
    },
  })
}
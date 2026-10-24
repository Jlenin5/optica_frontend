import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPrescription } from "../api/prescriptions.api"
import type { CreatePrescriptionDTO } from "../types/prescriptions.types"
import { notification } from "@/services/notification"

export const useCreatePrescription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePrescriptionDTO) => createPrescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] })
      queryClient.invalidateQueries({ queryKey: ["prescriptions", "stats"] })
      notification.success("Prescripción creada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la prescripción"
      notification.error(message)
      console.error("Error creating prescription:", error)
    },
  })
}
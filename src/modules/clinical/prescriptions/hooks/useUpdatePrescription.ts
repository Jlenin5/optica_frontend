import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePrescription } from "../api/prescriptions.api"
import type { UpdatePrescriptionDTO } from "../types/prescriptions.types"
import { notification } from "@/services/notification"

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePrescriptionDTO }) => 
      updatePrescription(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] })
      queryClient.invalidateQueries({ queryKey: ["prescriptions", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["prescriptions", "stats"] })
      notification.success("Prescripción actualizada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la prescripción"
      notification.error(message)
      console.error("Error updating prescription:", error)
    },
  })
}
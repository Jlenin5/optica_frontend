import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateMedicalRecord } from "../api/medical_records.api"
import type { UpdateMedicalRecordDTO } from "../types/medical_records.types"
import { notification } from "@/services/notification"

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicalRecordDTO }) =>
      updateMedicalRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", data.id] })
      queryClient.invalidateQueries({ queryKey: ["medical-record", "by-patient", data.patient_id] })
      notification.success("Historial clínico actualizado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el historial clínico"
      notification.error(message)
      console.error("Error updating medical record:", error)
    },
  })
}

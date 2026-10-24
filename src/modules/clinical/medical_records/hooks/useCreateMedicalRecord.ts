import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMedicalRecord } from "../api/medical_records.api"
import type { CreateMedicalRecordDTO } from "../types/medical_records.types"
import { notification } from "@/services/notification"

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMedicalRecordDTO) => createMedicalRecord(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", "by-patient", data.patient_id] })
      notification.success("Historial clínico creado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el historial clínico"
      notification.error(message)
      console.error("Error creating medical record:", error)
    },
  })
}

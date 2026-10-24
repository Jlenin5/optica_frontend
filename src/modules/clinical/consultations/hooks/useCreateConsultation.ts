import { useMutation, useQueryClient } from "@tanstack/react-query"
import http from "@/services/http"
import type { ConsultationFormData } from "../types/consultations.types"

export const useCreateConsultation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const { data: response } = await http.post("/consultations/", data)
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      queryClient.invalidateQueries({
        queryKey: ["medical-record", variables.medical_record_id]
      })
      if (variables.appointment) {
        queryClient.invalidateQueries({
          queryKey: ["appointment", variables.appointment]
        })
      }
    }
  })
}

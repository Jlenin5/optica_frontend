import { useMutation, useQueryClient } from "@tanstack/react-query"
import http from "@/services/http"
import type { ConsultationFormData } from "../types/consultations.types"

export const useUpdateConsultation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ConsultationFormData> }) => {
      const { data: response } = await http.put(`/consultations/${id}/`, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      queryClient.invalidateQueries({
        queryKey: ["consultation", data.id]
      })
    }
  })
}

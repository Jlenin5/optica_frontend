import { useMutation, useQueryClient } from "@tanstack/react-query"
import http from "@/services/http"

export const useDeleteConsultation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`/consultations/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
    }
  })
}

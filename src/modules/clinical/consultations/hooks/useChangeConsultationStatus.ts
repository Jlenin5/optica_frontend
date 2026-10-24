import { useMutation, useQueryClient } from "@tanstack/react-query"
import http from "@/services/http"

// Cambia únicamente el estado de la consulta (draft -> completed / cancelled).
// Usa PATCH (actualización parcial) a propósito: enviar solo { status } por
// PUT sobrescribiría el resto de los campos clínicos en un backend REST
// estándar que espera el recurso completo en cada PUT.
export const useChangeConsultationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await http.patch(`/consultations/${id}/`, { status })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] })
      queryClient.invalidateQueries({ queryKey: ["consultation", data.id] })
    }
  })
}

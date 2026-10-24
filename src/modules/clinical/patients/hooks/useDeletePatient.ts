import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePatient } from "../api/patients.api"
import { notification } from "@/services/notification"

export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patients", "stats"] })
      notification.success("Paciente eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el paciente"
      notification.error(message)
      console.error("Error deleting patient:", error)
    },
  })
}
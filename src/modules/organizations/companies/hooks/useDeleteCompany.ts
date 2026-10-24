import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCompany } from "../api/companies.api"
import { toast } from "react-hot-toast"

export const useDeleteCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: (_) => {
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      
      // Mostrar notificación de éxito
      toast.success("Empresa eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la empresa"
      toast.error(message)
      console.error("Error deleting company:", error)
    },
  })
}
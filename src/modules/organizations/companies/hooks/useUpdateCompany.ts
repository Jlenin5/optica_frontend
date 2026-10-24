import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCompany } from "../api/companies.api"
import type { Company } from "../types/companies.types"
import { toast } from "react-hot-toast"

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Company }) => 
      updateCompany(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] })
      
      // Mostrar notificación de éxito
      toast.success(`Empresa "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la empresa"
      toast.error(message)
      console.error("Error updating company:", error)
    },
  })
}
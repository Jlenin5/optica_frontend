import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCompany } from "../api/companies.api"
import type { Company } from "../types/companies.types"
import { toast } from "react-hot-toast" // o cualquier sistema de notificaciones

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Company) => createCompany(data),
    onSuccess: (data) => {
      // Invalidar queries de empresas
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      
      // Mostrar notificación de éxito
      toast.success(`Empresa "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      // Mostrar notificación de error
      const message = error.response?.data?.message || "Error al crear la empresa"
      toast.error(message)
      console.error("Error creating company:", error)
    },
  })
}
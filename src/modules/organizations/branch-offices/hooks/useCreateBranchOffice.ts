import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBranchOffice } from "../api/branch-offices.api"
import type { CreateBranchOfficeDTO } from "../types/branch-offices.types"
import { notification } from "@/services/notification"

export const useCreateBranchOffice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBranchOfficeDTO) => createBranchOffice(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["branch-offices"] })
      queryClient.invalidateQueries({ queryKey: ["branch-offices", "stats"] })
      notification.success(`Sucursal "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la sucursal"
      notification.error(message)
      console.error("Error creating branch office:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBranchOffice } from "../api/branch-offices.api"
import type { UpdateBranchOfficeDTO } from "../types/branch-offices.types"
import { notification } from "@/services/notification"

export const useUpdateBranchOffice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchOfficeDTO }) => 
      updateBranchOffice(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["branch-offices"] })
      queryClient.invalidateQueries({ queryKey: ["branch-offices", "stats"] })
      notification.success(`Sucursal "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la sucursal"
      notification.error(message)
      console.error("Error updating branch office:", error)
    },
  })
}
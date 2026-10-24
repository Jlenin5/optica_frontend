import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBranchOfficeStatus } from "../api/branch-offices.api"
import { notification } from "@/services/notification"

export const useToggleBranchOfficeStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleBranchOfficeStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["branch-offices"] })
      queryClient.invalidateQueries({ queryKey: ["branch-offices", "stats"] })
      const statusText = data.status ? "activada" : "desactivada"
      notification.success(`Sucursal ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado de la sucursal"
      notification.error(message)
      console.error("Error toggling branch office status:", error)
    },
  })
}
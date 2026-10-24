import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBranchOffice } from "../api/branch-offices.api"
import { notification } from "@/services/notification"

export const useDeleteBranchOffice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBranchOffice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-offices"] })
      queryClient.invalidateQueries({ queryKey: ["branch-offices", "stats"] })
      notification.success("Sucursal eliminada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la sucursal"
      notification.error(message)
      console.error("Error deleting branch office:", error)
    },
  })
}
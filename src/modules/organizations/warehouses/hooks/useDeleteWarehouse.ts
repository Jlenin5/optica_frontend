import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWarehouse } from "../api/warehouses.api"
import { notification } from "@/services/notification"

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouses", "stats"] })
      notification.success("Almacén eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el almacén"
      notification.error(message)
      console.error("Error deleting warehouse:", error)
    },
  })
}
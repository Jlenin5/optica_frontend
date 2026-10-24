import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleWarehouseStatus } from "../api/warehouses.api"
import { notification } from "@/services/notification"

export const useToggleWarehouseStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleWarehouseStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouses", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Almacén ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del almacén"
      notification.error(message)
      console.error("Error toggling warehouse status:", error)
    },
  })
}
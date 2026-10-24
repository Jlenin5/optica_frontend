import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleProductStatus } from "../api/products.api"
import { notification } from "@/services/notification"

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleProductStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", data.id] })
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] })
      const statusText = data.status ? "activado" : "desactivado"
      notification.success(`Producto ${statusText} exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del producto"
      notification.error(message)
      console.error("Error toggling product status:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProduct } from "../api/products.api"
import { notification } from "@/services/notification"

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] })
      notification.success("Producto eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el producto"
      notification.error(message)
      console.error("Error deleting product:", error)
    },
  })
}
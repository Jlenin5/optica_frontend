import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProduct } from "../api/products.api"
import type { UpdateProductDTO } from "../types/products.types"
import { notification } from "@/services/notification"

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDTO }) => 
      updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", data.id] })
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] })
      notification.success(`Producto "${data.name}" actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el producto"
      notification.error(message)
      console.error("Error updating product:", error)
    },
  })
}
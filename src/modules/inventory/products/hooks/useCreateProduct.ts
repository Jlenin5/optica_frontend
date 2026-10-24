import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "../api/products.api"
import type { CreateProductDTO } from "../types/products.types"
import { notification } from "@/services/notification"

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductDTO) => createProduct(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] })
      notification.success(`Producto "${data.name}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el producto"
      notification.error(message)
      console.error("Error creating product:", error)
    },
  })
}
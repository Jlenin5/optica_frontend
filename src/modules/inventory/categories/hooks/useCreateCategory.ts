import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory } from "../api/categories.api"
import type { CreateCategoryDTO } from "../types/categories.types"
import { notification } from "@/services/notification"

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryDTO) => createCategory(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] })
      notification.success(`Categoría "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la categoría"
      notification.error(message)
      console.error("Error creating category:", error)
    },
  })
}
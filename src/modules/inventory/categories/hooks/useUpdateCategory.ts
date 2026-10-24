import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCategory } from "../api/categories.api"
import type { UpdateCategoryDTO } from "../types/categories.types"
import { notification } from "@/services/notification"

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDTO }) => 
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", data.id] })
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] })
      notification.success(`Categoría "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la categoría"
      notification.error(message)
      console.error("Error updating category:", error)
    },
  })
}
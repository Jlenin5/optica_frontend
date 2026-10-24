import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleCategoryVisibility } from "../api/categories.api"
import { notification } from "@/services/notification"

export const useToggleCategoryVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, visible_on_web }: { id: number; visible_on_web: boolean }) => 
      toggleCategoryVisibility(id, visible_on_web),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", data.id] })
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] })
      const visibilityText = data.visible_on_web ? "visible en web" : "oculta en web"
      notification.success(`Categoría ahora es ${visibilityText}`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar la visibilidad de la categoría"
      notification.error(message)
      console.error("Error toggling category visibility:", error)
    },
  })
}
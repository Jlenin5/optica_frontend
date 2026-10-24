import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBrandVisibility } from "../api/brands.api"
import { notification } from "@/services/notification"

export const useToggleBrandVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, visible_on_web }: { id: number; visible_on_web: boolean }) => 
      toggleBrandVisibility(id, visible_on_web),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", data.id] })
      queryClient.invalidateQueries({ queryKey: ["brands", "stats"] })
      const visibilityText = data.visible_on_web ? "visible en web" : "oculta en web"
      notification.success(`Marca ahora es ${visibilityText}`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cambiar la visibilidad de la marca"
      notification.error(message)
      console.error("Error toggling brand visibility:", error)
    },
  })
}
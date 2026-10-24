import { useMutation, useQueryClient } from "@tanstack/react-query"
import { activateSubscription } from "../api/subscriptions.api"
import { notification } from "@/services/notification"

export const useActivateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => activateSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "stats"] })
      notification.success("Suscripción activada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al activar la suscripción"
      notification.error(message)
      console.error("Error activating subscription:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cancelSubscription } from "../api/subscriptions.api"
import { notification } from "@/services/notification"

export const useCancelSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "stats"] })
      notification.success("Suscripción cancelada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al cancelar la suscripción"
      notification.error(message)
      console.error("Error canceling subscription:", error)
    },
  })
}
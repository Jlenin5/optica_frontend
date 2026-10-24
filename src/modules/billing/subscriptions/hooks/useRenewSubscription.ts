import { useMutation, useQueryClient } from "@tanstack/react-query"
import { renewSubscription } from "../api/subscriptions.api"
import { notification } from "@/services/notification"

export const useRenewSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => renewSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "stats"] })
      notification.success("Suscripción renovada exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al renovar la suscripción"
      notification.error(message)
      console.error("Error renewing subscription:", error)
    },
  })
}
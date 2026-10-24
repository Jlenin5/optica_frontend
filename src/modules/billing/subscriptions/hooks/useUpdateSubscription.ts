import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateSubscription } from "../api/subscriptions.api"
import type { UpdateSubscriptionDTO } from "../types/subscriptions.types"
import { notification } from "@/services/notification"

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubscriptionDTO }) => 
      updateSubscription(id, data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "stats"] })
      notification.success(`Suscripción actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la suscripción"
      notification.error(message)
      console.error("Error updating subscription:", error)
    },
  })
}
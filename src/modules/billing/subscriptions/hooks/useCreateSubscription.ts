import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSubscription } from "../api/subscriptions.api"
import type { CreateSubscriptionDTO } from "../types/subscriptions.types"
import { notification } from "@/services/notification"

export const useCreateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubscriptionDTO) => createSubscription(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "stats"] })
      notification.success(`Suscripción creada para ${data.company.name}`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la suscripción"
      notification.error(message)
      console.error("Error creating subscription:", error)
    },
  })
}
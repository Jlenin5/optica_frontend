import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateFeature } from "../api/features.api"
import type { Feature } from "../types/features.types"
import { notification } from "@/services/notification"

export const useUpdateFeature = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Feature> }) => 
      updateFeature(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["features"] })
      notification.success(`Característica "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la característica"
      notification.error(message)
      console.error("Error updating feature:", error)
    },
  })
}
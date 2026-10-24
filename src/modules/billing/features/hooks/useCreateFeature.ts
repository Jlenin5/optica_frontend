import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFeature } from "../api/features.api"
import type { Feature } from "../types/features.types"
import { notification } from "@/services/notification"

export const useCreateFeature = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Feature, 'id'>) => createFeature(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["features"] })
      notification.success(`Característica "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la característica"
      notification.error(message)
      console.error("Error creating feature:", error)
    },
  })
}
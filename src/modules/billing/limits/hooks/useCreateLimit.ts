import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createLimit } from "../api/limits.api"
import type { Limit } from "../types/limits.types"
import { notification } from "@/services/notification"

export const useCreateLimit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Limit, 'id'>) => createLimit(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["limits"] })
      notification.success(`Límite "${data.name}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el límite"
      notification.error(message)
      console.error("Error creating limit:", error)
    },
  })
}
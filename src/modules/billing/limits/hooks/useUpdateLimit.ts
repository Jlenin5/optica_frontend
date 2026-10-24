import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLimit } from "../api/limits.api"
import type { Limit } from "../types/limits.types"
import { notification } from "@/services/notification"

export const useUpdateLimit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Limit> }) => 
      updateLimit(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["limits"] })
      notification.success(`Límite "${data.name}" actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el límite"
      notification.error(message)
      console.error("Error updating limit:", error)
    },
  })
}
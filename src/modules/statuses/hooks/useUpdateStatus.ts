import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "../api/statuses.api"
import type { UpdateStatusDTO } from "../types/statuses.types"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useUpdateStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStatusDTO }) => updateStatus(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
      queryClient.invalidateQueries({ queryKey: ["statuses", data.id] })
      queryClient.invalidateQueries({ queryKey: ["statuses", "stats"] })
      notification.success(`Estado "${data.name}" actualizado exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al actualizar el estado"
      notification.error(message)
    },
  })
}

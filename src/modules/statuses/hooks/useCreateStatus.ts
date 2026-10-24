import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createStatus } from "../api/statuses.api"
import type { CreateStatusDTO } from "../types/statuses.types"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useCreateStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStatusDTO) => createStatus(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
      queryClient.invalidateQueries({ queryKey: ["statuses", "stats"] })
      notification.success(`Estado "${data.name}" creado exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al crear el estado"
      notification.error(message)
    },
  })
}

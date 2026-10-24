import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleStatusDefault } from "../api/statuses.api"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useToggleStatusStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, is_default }: { id: number; is_default: boolean }) =>
      toggleStatusDefault(id, is_default),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
      queryClient.invalidateQueries({ queryKey: ["statuses", data.id] })
      queryClient.invalidateQueries({ queryKey: ["statuses", "stats"] })
      const statusText = data.is_default ? "marcado como predeterminado" : "desmarcado como predeterminado"
      notification.success(`Estado "${data.name}" ${statusText}`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al cambiar el estado predeterminado"
      notification.error(message)
    },
  })
}

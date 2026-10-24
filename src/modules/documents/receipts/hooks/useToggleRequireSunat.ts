import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleRequireSunat } from "../api/receipts.api"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useToggleRequireSunat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, requires_sunat }: { id: number; requires_sunat: boolean }) => 
      toggleRequireSunat(id, requires_sunat),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] })
      queryClient.invalidateQueries({ queryKey: ["receipts", "stats"] })
      const statusText = data.requires_sunat ? "activado" : "desactivado"
      notification.success(`Recibo ${statusText} exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al cambiar el estado del recibo"
      notification.error(message)
      console.error("Error toggling receipt status:", error)
    },
  })
}
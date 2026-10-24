import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateDayOfCredit } from "../api/days-of-credit.api"
import type { UpdateDayOfCreditDTO } from "../types/days-of-credit.types"
import { notification } from "@/services/notification"

export const useUpdateDayOfCredit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDayOfCreditDTO }) => 
      updateDayOfCredit(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["days-of-credit"] })
      queryClient.invalidateQueries({ queryKey: ["days-of-credit", data.id] })
      queryClient.invalidateQueries({ queryKey: ["days-of-credit", "stats"] })
      notification.success(`Día de crédito actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el día de crédito"
      notification.error(message)
      console.error("Error updating day of credit:", error)
    },
  })
}
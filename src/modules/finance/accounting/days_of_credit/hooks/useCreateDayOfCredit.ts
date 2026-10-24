import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDayOfCredit } from "../api/days-of-credit.api"
import type { CreateDayOfCreditDTO } from "../types/days-of-credit.types"
import { notification } from "@/services/notification"

export const useCreateDayOfCredit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDayOfCreditDTO) => createDayOfCredit(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["days-of-credit"] })
      queryClient.invalidateQueries({ queryKey: ["days-of-credit", "stats"] })
      notification.success(`Día de crédito "${data.amount_in_days}" días creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el día de crédito"
      notification.error(message)
      console.error("Error creating day of credit:", error)
    },
  })
}
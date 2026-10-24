import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser } from "../api/users.api"
import type { UpdateUserDTO } from "../types/users.types"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDTO }) => updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", data.id] })
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] })
      notification.success(`Usuario "${data.username}" actualizado exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al actualizar el usuario"
      notification.error(message)
    },
  })
}
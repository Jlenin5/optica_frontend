import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createUser } from "../api/users.api"
import type { CreateUserDTO } from "../types/users.types"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDTO) => createUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] })
      notification.success(`Usuario "${data.username}" creado exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al crear el usuario"
      notification.error(message)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createStore } from "../api/stores.api"
import type { CreateStoreDTO } from "../types/stores.types"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useCreateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoreDTO) => createStore(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores", "stats"] })
      notification.success(`Tienda "${data.name}" creada exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al crear la tienda"
      notification.error(message)
      console.error("Error creating store:", error)
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStore } from "../api/stores.api"
import type { UpdateStoreDTO } from "../types/stores.types"
import { notification } from "@/services/notification"

export const useUpdateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStoreDTO }) => 
      updateStore(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores", "stats"] })
      notification.success(`Tienda "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la tienda"
      notification.error(message)
      console.error("Error updating store:", error)
    },
  })
}
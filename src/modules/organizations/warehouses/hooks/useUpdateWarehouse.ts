import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateWarehouse } from "../api/warehouses.api"
import type { UpdateWarehouseDTO } from "../types/warehouses.types"
import { notification } from "@/services/notification"

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWarehouseDTO }) => 
      updateWarehouse(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouses", "stats"] })
      notification.success(`Almacén "${data.name}" actualizado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el almacén"
      notification.error(message)
      console.error("Error updating warehouse:", error)
    },
  })
}
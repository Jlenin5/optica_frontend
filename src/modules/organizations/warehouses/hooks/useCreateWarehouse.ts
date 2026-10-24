import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWarehouse } from "../api/warehouses.api"
import type { CreateWarehouseDTO } from "../types/warehouses.types"
import { notification } from "@/services/notification"

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWarehouseDTO) => createWarehouse(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouses", "stats"] })
      notification.success(`Almacén "${data.name}" creado exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear el almacén"
      notification.error(message)
      console.error("Error creating warehouse:", error)
    },
  })
}
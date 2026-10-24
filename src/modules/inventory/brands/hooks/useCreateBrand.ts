import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBrand } from "../api/brands.api"
import type { CreateBrandDTO } from "../types/brands.types"
import { notification } from "@/services/notification"

export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, imageFile }: { data: CreateBrandDTO; imageFile?: File | null }) => 
      createBrand(data, imageFile),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", "stats"] })
      notification.success(`Marca "${data.name}" creada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al crear la marca"
      notification.error(message)
      console.error("Error creating brand:", error)
    },
  })
}
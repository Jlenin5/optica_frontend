import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBrand } from "../api/brands.api"
import type { UpdateBrandDTO } from "../types/brands.types"
import { notification } from "@/services/notification"

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data, imageFile, removeLogo }: { id: number; data: UpdateBrandDTO; imageFile?: File | null; removeLogo?: boolean }) => 
      updateBrand(id, data, imageFile, removeLogo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", data.id] })
      queryClient.invalidateQueries({ queryKey: ["brands", "stats"] })
      notification.success(`Marca "${data.name}" actualizada exitosamente`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la marca"
      notification.error(message)
      console.error("Error updating brand:", error)
    },
  })
}
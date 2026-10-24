import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadCategoryImage } from "../api/categories.api"
import { notification } from "@/services/notification"

export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file, onProgress }: any) =>
      uploadCategoryImage(id, file, onProgress),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] })

      notification.success("Imagen de categoría actualizada exitosamente")
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Error al subir la imagen"

      notification.error(message)
      console.error("Error uploading category image:", error)
    },
  })
}
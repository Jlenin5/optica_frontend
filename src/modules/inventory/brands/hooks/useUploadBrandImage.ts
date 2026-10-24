import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadBrandImage } from "../api/brands.api"
import { notification } from "@/services/notification"

export const useUploadBrandImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file, onProgress }: any) =>
      uploadBrandImage(id, file, onProgress),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["brands", "stats"] })

      notification.success("Imagen de marca actualizada exitosamente")
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Error al subir la imagen"

      notification.error(message)
    }
  })
}
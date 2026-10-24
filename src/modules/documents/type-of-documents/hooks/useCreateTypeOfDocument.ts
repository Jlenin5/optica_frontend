import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTypeOfDocument } from "../api/type-of-documents.api"
import type { CreateTypeOfDocumentDTO } from "../types/type-of-documents.types"
import { toast } from "react-hot-toast"

export const useCreateTypeOfDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTypeOfDocumentDTO) => createTypeOfDocument(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-of-documents"] })
      toast.success('Tipo de documento creado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el tipo de documento')
    },
  })
}
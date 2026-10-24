import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTypeOfDocument } from "../api/type-of-documents.api"
import { toast } from "react-hot-toast"
import type { TypeOfDocument } from "../types/type-of-documents.types"
import type { BackendErrorResponse } from "@/types/global.types"

export const useUpdateTypeOfDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TypeOfDocument }) => 
      updateTypeOfDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-of-documents"] })
      toast.success('Tipo de documento actualizado exitosamente')
    },
    onError: (error: BackendErrorResponse) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el tipo de documento')
    },
  })
}
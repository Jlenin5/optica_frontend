import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTypeOfDocument } from "../api/type-of-documents.api"
import { toast } from "react-hot-toast"

export const useDeleteTypeOfDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTypeOfDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-of-documents"] })
      toast.success('Tipo de documento eliminado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el tipo de documento')
    },
  })
}
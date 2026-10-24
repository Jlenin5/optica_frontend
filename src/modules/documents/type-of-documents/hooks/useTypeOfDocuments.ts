import { useQuery } from "@tanstack/react-query"
import { getTypeOfDocuments } from "../api/type-of-documents.api"
import type { GetTypeOfDocumentsParams } from "../types/type-of-documents.types"

export const useTypeOfDocuments = (params?: GetTypeOfDocumentsParams) => {
  return useQuery({
    queryKey: ["type-of-documents", params],
    queryFn: () => getTypeOfDocuments(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
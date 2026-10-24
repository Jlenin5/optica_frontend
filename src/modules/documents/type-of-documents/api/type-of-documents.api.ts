import http from "@/services/http"
import type { 
  TypeOfDocument,
  GetTypeOfDocumentsParams
} from "../types/type-of-documents.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getTypeOfDocuments = async (params?: GetTypeOfDocumentsParams): Promise<PaginatedResponse<TypeOfDocument>> => {
  try {
    const response = await http.get<PaginatedResponse<TypeOfDocument>>('/type-of-documents', {
      params: {
        limit: params?.limit || 10,
        offset: params?.offset || 0,
        search: params?.search
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching document types:', error)
    throw error
  }
}

export const getTypeOfDocumentById = async (id: number): Promise<TypeOfDocument> => {
  try {
    const response = await http.get<TypeOfDocument>(`/type-of-documents/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching document type ${id}:`, error)
    throw error
  }
}

export const createTypeOfDocument = async (data: TypeOfDocument): Promise<TypeOfDocument> => {
  try {
    const response = await http.post<TypeOfDocument>('/type-of-documents', data)
    return response.data
  } catch (error) {
    console.error('Error creating document type:', error)
    throw error
  }
}

export const updateTypeOfDocument = async (id: number, data: TypeOfDocument): Promise<TypeOfDocument> => {
  try {
    const response = await http.put<TypeOfDocument>(`/type-of-documents/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating document type ${id}:`, error)
    throw error
  }
}

export const deleteTypeOfDocument = async (id: number): Promise<void> => {
  try {
    await http.delete(`/type-of-documents/${id}`)
  } catch (error) {
    console.error(`Error deleting document type ${id}:`, error)
    throw error
  }
}
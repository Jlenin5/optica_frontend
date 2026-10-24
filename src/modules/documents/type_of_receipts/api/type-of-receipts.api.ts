import http from "@/services/http"
import type { 
  TypeOfReceipt, 
  GetTypeOfReceiptsParams, 
  PaginatedResponse,
  CreateTypeOfReceiptDTO,
  UpdateTypeOfReceiptDTO,
  TypeOfReceiptStats
} from "../types/type-of-receipts.types"

export const getTypeOfReceipts = async (params?: GetTypeOfReceiptsParams): Promise<PaginatedResponse<TypeOfReceipt>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.receipt_id) queryParams.append('receipt_id', String(params.receipt_id))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `/type-of-receipts?${queryParams.toString()}` : '/type-of-receipts'
    const response = await http.get<PaginatedResponse<TypeOfReceipt>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching type of receipts:', error)
    throw error
  }
}

export const getTypeOfReceiptById = async (id: number): Promise<TypeOfReceipt> => {
  try {
    const response = await http.get<TypeOfReceipt>(`/type-of-receipts/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching type of receipt ${id}:`, error)
    throw error
  }
}

export const createTypeOfReceipt = async (data: CreateTypeOfReceiptDTO): Promise<TypeOfReceipt> => {
  try {
    const response = await http.post<TypeOfReceipt>('/type-of-receipts', data)
    return response.data
  } catch (error) {
    console.error('Error creating type of receipt:', error)
    throw error
  }
}

export const updateTypeOfReceipt = async (id: number, data: UpdateTypeOfReceiptDTO): Promise<TypeOfReceipt> => {
  try {
    const response = await http.patch<TypeOfReceipt>(`/type-of-receipts/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating type of receipt ${id}:`, error)
    throw error
  }
}

export const deleteTypeOfReceipt = async (id: number): Promise<void> => {
  try {
    await http.delete(`/type-of-receipts/${id}`)
  } catch (error) {
    console.error(`Error deleting type of receipt ${id}:`, error)
    throw error
  }
}

export const toggleTypeOfReceiptStatus = async (id: number, status: boolean): Promise<TypeOfReceipt> => {
  try {
    const response = await http.patch<TypeOfReceipt>(`/type-of-receipts/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling type of receipt status ${id}:`, error)
    throw error
  }
}

export const getTypeOfReceiptStats = async (): Promise<TypeOfReceiptStats> => {
  try {
    const response = await http.get<TypeOfReceiptStats>('/type-of-receipts/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching type of receipt stats:', error)
    throw error
  }
}
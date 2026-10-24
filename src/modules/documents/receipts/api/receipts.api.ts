import http from "@/services/http"
import type { 
  Receipt, 
  GetReceiptsParams, 
  CreateReceiptDTO,
  UpdateReceiptDTO,
  ReceiptStats
} from "../types/receipts.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getReceipts = async (params?: GetReceiptsParams): Promise<PaginatedResponse<Receipt>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.requires_sunat !== undefined) queryParams.append('requires_sunat', String(params.requires_sunat))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `/receipts?${queryParams.toString()}` : '/receipts'
    const response = await http.get<PaginatedResponse<Receipt>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching receipts:', error)
    throw error
  }
}

export const getReceiptById = async (id: number): Promise<Receipt> => {
  try {
    const response = await http.get<Receipt>(`/receipts/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching receipt ${id}:`, error)
    throw error
  }
}

export const createReceipt = async (data: CreateReceiptDTO): Promise<Receipt> => {
  try {
    const response = await http.post<Receipt>('/receipts', data)
    return response.data
  } catch (error) {
    console.error('Error creating receipt:', error)
    throw error
  }
}

export const updateReceipt = async (id: number, data: UpdateReceiptDTO): Promise<Receipt> => {
  try {
    const response = await http.patch<Receipt>(`/receipts/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating receipt ${id}:`, error)
    throw error
  }
}

export const deleteReceipt = async (id: number): Promise<void> => {
  try {
    await http.delete(`/receipts/${id}`)
  } catch (error) {
    console.error(`Error deleting receipt ${id}:`, error)
    throw error
  }
}

export const toggleRequireSunat = async (id: number, requires_sunat: boolean): Promise<Receipt> => {
  try {
    const response = await http.patch<Receipt>(`/receipts/${id}/requires-sunat`, { requires_sunat })
    return response.data
  } catch (error) {
    console.error(`Error toggling requires sunat ${id}:`, error)
    throw error
  }
}

export const toggleReceiptStatus = async (id: number, status: boolean): Promise<Receipt> => {
  try {
    const response = await http.patch<Receipt>(`/receipts/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling receipt status ${id}:`, error)
    throw error
  }
}

export const getReceiptStats = async (): Promise<ReceiptStats> => {
  try {
    const response = await http.get<ReceiptStats>('/receipts/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching receipt stats:', error)
    throw error
  }
}
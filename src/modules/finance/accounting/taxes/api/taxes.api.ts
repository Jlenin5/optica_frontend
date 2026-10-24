import http from "@/services/http"
import type {
  Tax,
  GetTaxesParams,
  PaginatedResponse,
  CreateTaxDTO,
  UpdateTaxDTO,
  TaxStats
} from "../types/taxes.types"

export const getTaxes = async (params?: GetTaxesParams): Promise<PaginatedResponse<Tax>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    
    const url = queryParams.toString() ? `/taxes?${queryParams.toString()}` : '/taxes'
    const response = await http.get<PaginatedResponse<Tax>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching taxes:', error)
    throw error
  }
}

export const getTaxById = async (id: number): Promise<Tax> => {
  try {
    const response = await http.get<Tax>(`/taxes/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching tax ${id}:`, error)
    throw error
  }
}

export const createTax = async (data: CreateTaxDTO): Promise<Tax> => {
  try {
    const response = await http.post<Tax>('/taxes', data)
    return response.data
  } catch (error) {
    console.error('Error creating tax:', error)
    throw error
  }
}

export const updateTax = async (id: number, data: UpdateTaxDTO): Promise<Tax> => {
  try {
    const response = await http.patch<Tax>(`/taxes/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating tax ${id}:`, error)
    throw error
  }
}

export const deleteTax = async (id: number): Promise<void> => {
  try {
    await http.delete(`/taxes/${id}`)
  } catch (error) {
    console.error(`Error deleting tax ${id}:`, error)
    throw error
  }
}

export const getTaxStats = async (): Promise<TaxStats> => {
  try {
    const response = await http.get<TaxStats>('/taxes/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching tax stats:', error)
    throw error
  }
}
import http from "@/services/http"
import type {
  PaymentType,
  GetPaymentTypesParams,
  PaginatedResponse,
  CreatePaymentTypeDTO,
  UpdatePaymentTypeDTO,
  PaymentTypeStats
} from "../types/payment-types.types"

export const getPaymentTypes = async (params?: GetPaymentTypesParams): Promise<PaginatedResponse<PaymentType>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/payment-types?${queryParams.toString()}` : '/payment-types'
    const response = await http.get<PaginatedResponse<PaymentType>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching payment types:', error)
    throw error
  }
}

export const getPaymentTypeById = async (id: number): Promise<PaymentType> => {
  try {
    const response = await http.get<PaymentType>(`/payment-types/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching payment type ${id}:`, error)
    throw error
  }
}

export const createPaymentType = async (data: CreatePaymentTypeDTO): Promise<PaymentType> => {
  try {
    const response = await http.post<PaymentType>('/payment-types', data)
    return response.data
  } catch (error) {
    console.error('Error creating payment type:', error)
    throw error
  }
}

export const updatePaymentType = async (id: number, data: UpdatePaymentTypeDTO): Promise<PaymentType> => {
  try {
    const response = await http.patch<PaymentType>(`/payment-types/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating payment type ${id}:`, error)
    throw error
  }
}

export const deletePaymentType = async (id: number): Promise<void> => {
  try {
    await http.delete(`/payment-types/${id}`)
  } catch (error) {
    console.error(`Error deleting payment type ${id}:`, error)
    throw error
  }
}

export const getPaymentTypeStats = async (): Promise<PaymentTypeStats> => {
  try {
    const response = await http.get<PaymentTypeStats>('/payment-types/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching payment type stats:', error)
    throw error
  }
}
import http from "@/services/http"
import type {
  PaymentMethod,
  GetPaymentMethodsParams,
  PaginatedResponse,
  CreatePaymentMethodDTO,
  UpdatePaymentMethodDTO,
  PaymentMethodStats
} from "../types/payment-methods.types"

export const getPaymentMethods = async (params?: GetPaymentMethodsParams): Promise<PaginatedResponse<PaymentMethod>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/payment-methods?${queryParams.toString()}` : '/payment-methods'
    const response = await http.get<PaginatedResponse<PaymentMethod>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    throw error
  }
}

export const getPaymentMethodById = async (id: number): Promise<PaymentMethod> => {
  try {
    const response = await http.get<PaymentMethod>(`/payment-methods/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching payment method ${id}:`, error)
    throw error
  }
}

export const createPaymentMethod = async (data: CreatePaymentMethodDTO): Promise<PaymentMethod> => {
  try {
    const response = await http.post<PaymentMethod>('/payment-methods', data)
    return response.data
  } catch (error) {
    console.error('Error creating payment method:', error)
    throw error
  }
}

export const updatePaymentMethod = async (id: number, data: UpdatePaymentMethodDTO): Promise<PaymentMethod> => {
  try {
    const response = await http.patch<PaymentMethod>(`/payment-methods/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating payment method ${id}:`, error)
    throw error
  }
}

export const deletePaymentMethod = async (id: number): Promise<void> => {
  try {
    await http.delete(`/payment-methods/${id}`)
  } catch (error) {
    console.error(`Error deleting payment method ${id}:`, error)
    throw error
  }
}

export const getPaymentMethodStats = async (): Promise<PaymentMethodStats> => {
  try {
    const response = await http.get<PaymentMethodStats>('/payment-methods/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching payment method stats:', error)
    throw error
  }
}
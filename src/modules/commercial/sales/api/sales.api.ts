import http from "@/services/http"
import type {
  Sale,
  CreateSaleDTO,
  SaleFilters,
  PaginatedResponse,
  SaleStats
} from "../types/sales.types"

export const getSales = async (params?: SaleFilters): Promise<PaginatedResponse<Sale>> => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.patient_id) queryParams.append('patient_id', String(params.patient_id))
    if (params?.appointment_id) queryParams.append('appointment_id', String(params.appointment_id))
    if (params?.sale_status_id) queryParams.append('sale_status_id', String(params.sale_status_id))
    if (params?.payment_method_id) queryParams.append('payment_method_id', String(params.payment_method_id))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.store_id) queryParams.append('store_id', String(params.store_id))
    
    const url = queryParams.toString() ? `/sales?${queryParams.toString()}` : '/sales'
    const response = await http.get<PaginatedResponse<Sale>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching sales:', error)
    throw error
  }
}

export const getSaleById = async (id: number): Promise<Sale> => {
  try {
    const response = await http.get<Sale>(`/sales/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching sale ${id}:`, error)
    throw error
  }
}

export const createSale = async (data: CreateSaleDTO): Promise<Sale> => {
  try {
    const response = await http.post<Sale>('/sales', data)
    return response.data
  } catch (error) {
    console.error('Error creating sale:', error)
    throw error
  }
}

export const updateSale = async (id: number, data: CreateSaleDTO): Promise<Sale> => {
  try {
    const response = await http.patch<Sale>(`/sales/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating sale ${id}:`, error)
    throw error
  }
}

export const deleteSale = async (id: number): Promise<void> => {
  try {
    await http.delete(`/sales/${id}`)
  } catch (error) {
    console.error(`Error deleting sale ${id}:`, error)
    throw error
  }
}

export const getSaleStats = async (params?: { company_id?: number; store_id?: number; date_from?: string; date_to?: string }): Promise<SaleStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.store_id) queryParams.append('store_id', String(params.store_id))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `/sales/stats?${queryParams.toString()}` : '/sales/stats'
    const response = await http.get<SaleStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching sale stats:', error)
    throw error
  }
}

export const generateReceiptNumber = async (typeOfReceiptId: number): Promise<{ series: string; number: number; bill: string }> => {
  try {
    const response = await http.post('/sales/generate-receipt-number', { type_of_receipt_id: typeOfReceiptId })
    return response.data
  } catch (error) {
    console.error('Error generating receipt number:', error)
    throw error
  }
}
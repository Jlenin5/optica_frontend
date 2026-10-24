import http from "@/services/http"
import type {
  Bank,
  GetBanksParams,
  PaginatedResponse,
  CreateBankDTO,
  UpdateBankDTO,
  BankStats
} from "../types/banks.types"

export const getBanks = async (params?: GetBanksParams): Promise<PaginatedResponse<Bank>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/banks?${queryParams.toString()}` : '/banks'
    const response = await http.get<PaginatedResponse<Bank>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching banks:', error)
    throw error
  }
}

export const getBankById = async (id: number): Promise<Bank> => {
  try {
    const response = await http.get<Bank>(`/banks/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching bank ${id}:`, error)
    throw error
  }
}

export const createBank = async (data: CreateBankDTO): Promise<Bank> => {
  try {
    const response = await http.post<Bank>('/banks', data)
    return response.data
  } catch (error) {
    console.error('Error creating bank:', error)
    throw error
  }
}

export const updateBank = async (id: number, data: UpdateBankDTO): Promise<Bank> => {
  try {
    const response = await http.patch<Bank>(`/banks/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating bank ${id}:`, error)
    throw error
  }
}

export const deleteBank = async (id: number): Promise<void> => {
  try {
    await http.delete(`/banks/${id}`)
  } catch (error) {
    console.error(`Error deleting bank ${id}:`, error)
    throw error
  }
}

export const getBankStats = async (): Promise<BankStats> => {
  try {
    const response = await http.get<BankStats>('/banks/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching bank stats:', error)
    throw error
  }
}
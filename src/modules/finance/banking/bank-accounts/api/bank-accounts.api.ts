import http from "@/services/http"
import type {
  BankAccount,
  GetBankAccountsParams,
  PaginatedResponse,
  CreateBankAccountDTO,
  UpdateBankAccountDTO,
  BankAccountStats
} from "../types/bank-accounts.types"

export const getBankAccounts = async (params?: GetBankAccountsParams): Promise<PaginatedResponse<BankAccount>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.bank_id) queryParams.append('bank_id', String(params.bank_id))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.currency_id) queryParams.append('currency_id', String(params.currency_id))
    
    const url = queryParams.toString() ? `/bank-accounts?${queryParams.toString()}` : '/bank-accounts'
    const response = await http.get<PaginatedResponse<BankAccount>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    throw error
  }
}

export const getBankAccountById = async (id: number): Promise<BankAccount> => {
  try {
    const response = await http.get<BankAccount>(`/bank-accounts/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching bank account ${id}:`, error)
    throw error
  }
}

export const createBankAccount = async (data: CreateBankAccountDTO): Promise<BankAccount> => {
  try {
    const response = await http.post<BankAccount>('/bank-accounts', data)
    return response.data
  } catch (error) {
    console.error('Error creating bank account:', error)
    throw error
  }
}

export const updateBankAccount = async (id: number, data: UpdateBankAccountDTO): Promise<BankAccount> => {
  try {
    const response = await http.patch<BankAccount>(`/bank-accounts/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating bank account ${id}:`, error)
    throw error
  }
}

export const deleteBankAccount = async (id: number): Promise<void> => {
  try {
    await http.delete(`/bank-accounts/${id}`)
  } catch (error) {
    console.error(`Error deleting bank account ${id}:`, error)
    throw error
  }
}

export const getBankAccountStats = async (companyId?: number): Promise<BankAccountStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/bank-accounts/stats?${queryParams.toString()}` : '/bank-accounts/stats'
    const response = await http.get<BankAccountStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching bank account stats:', error)
    throw error
  }
}
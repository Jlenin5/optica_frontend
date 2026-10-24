import type { Company } from "@companies/types/companies.types"
import type { Store } from "@stores/types/stores.types"
import type { User } from "@users/types/users.types"

export interface CashRegister {
  id: number
  name: string
  description: string | null
  company: Company | null
  company_id?: number | null
  store: Store | null
  store_id: number | null
  status: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface CashRegisterSession {
  id: number
  cash_register: CashRegister
  cash_register_id: number
  cash_register_session_id: number
  user: User | null
  user_id: number | null
  opened_at: string
  closed_at: string | null
  opening_amount: number
  closing_amount: number | null
  expected_amount: number | null
  difference_amount: number | null
  notes: string | null
  status: 'open' | 'closed'
  created_at: string
  updated_at: string
}

export interface GetCashRegistersParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  store_id?: number
  company_id?: number
}

export interface GetCashRegisterSessionsParams {
  limit?: number
  offset?: number
  cash_register_id?: number
  user_id?: number
  status?: 'open' | 'closed'
  date_from?: string
  date_to?: string
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateCashRegisterDTO {
  name: string
  description?: string | null
  store_id?: number | null
  company_id?: number | null
  status?: boolean
}

export interface UpdateCashRegisterDTO {
  name?: string
  description?: string | null
  store_id?: number | null
  company_id?: number | null
  status?: boolean
}

export interface OpenCashRegisterDTO {
  cash_register_id: number
  opening_amount: number
  notes?: string | null
}

export interface CloseCashRegisterDTO {
  closing_amount: number
  notes?: string | null
}

export interface CashRegisterSessionSummary {
  cash_register: CashRegister
  session: CashRegisterSession
  summary: {
    opening_amount: number
    total_income: number
    total_expense: number
    expected_amount: number
    closing_amount: number | null
    difference_amount: number | null
  }
}

export interface CashRegisterSummary {
  cash_register: CashRegister
  summary: {
    opening_amount: number
    total_income: number
    total_expense: number
    expected_amount: number
    closing_amount: number | null
    difference_amount: number | null
  }
}

export interface CashRegisterStats {
  total_registers: number
  active_registers: number
  inactive_registers: number
  open_sessions: number
  closed_sessions: number
  by_store: Array<{
    store_id: number
    store_name: string
    count: number
  }>
}
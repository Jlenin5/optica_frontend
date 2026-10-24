import type { Company } from "@/modules/organizations/companies/types/companies.types"
import type { CashRegister, CashRegisterSession } from "@/modules/finance/cash/cash_registers/types/cash-registers.types"
import type { PaymentMethod } from "@/modules/finance/payments/payment_methods/types/payment-methods.types"

export type MovementType = 'income' | 'expense'
export type SourceType = 'sale' | 'payment' | 'manual' | 'expense' | 'adjustment'

export interface CashMovement {
  id: number
  company: Company | null
  company_id?: number | null
  cash_register: CashRegister | null
  cash_register_id: number | null
  cash_register_session: CashRegisterSession
  cash_register_session_id: number
  movement_type: MovementType
  movement_type_display: string
  source: SourceType
  source_display: string
  amount: number
  description: string | null
  payment_method: PaymentMethod | null
  payment_method_id: number | null
  reference_id: number | null
  reference_type: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetCashMovementsParams {
  limit?: number
  offset?: number
  search?: string
  movement_type?: MovementType
  source?: SourceType
  cash_register_id?: number
  payment_method_id?: number
  date_from?: string
  date_to?: string
  company_id?: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateCashMovementDTO {
  company_id?: number | null
  cash_register_id: number
  cash_register_session_id: number
  movement_type: MovementType
  source: SourceType
  amount: number
  description?: string | null
  payment_method_id?: number | null
  reference_id?: number | null
  reference_type?: string | null
}

export interface UpdateCashMovementDTO {
  description?: string | null
  amount?: number
  payment_method_id?: number | null
}

export interface CashMovementStats {
  total_income: number
  total_expense: number
  balance: number
  by_source: Array<{
    source: string
    source_display: string
    total: number
    count: number
  }>
  by_payment_method: Array<{
    payment_method_id: number
    payment_method_name: string
    total: number
    count: number
  }>
  today_income: number
  today_expense: number
  this_week_income: number
  this_week_expense: number
}
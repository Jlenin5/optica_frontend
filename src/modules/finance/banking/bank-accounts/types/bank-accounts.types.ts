import type { Bank } from "@banks/types/banks.types"
import type { Currency } from "@currencies/types/currencies.types"
import type { Company } from "@companies/types/companies.types"

export interface BankAccount {
  id: number
  description: string | null
  bank: Bank | null
  bank_id: number | null
  company: Company | null
  company_id?: number | null
  currency: Currency | null
  currency_id: number | null
  account_number: string | null
  cci_number: string | null
  diary: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetBankAccountsParams {
  limit?: number
  offset?: number
  search?: string
  bank_id?: number
  company_id?: number
  currency_id?: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateBankAccountDTO {
  description?: string | null
  bank_id: number
  company_id?: number | null
  currency_id?: number | null
  account_number?: string | null
  cci_number?: string | null
  diary?: string | null
}

export interface UpdateBankAccountDTO {
  description?: string | null
  bank_id?: number
  company_id?: number
  currency_id?: number | null
  account_number?: string | null
  cci_number?: string | null
  diary?: string | null
}

export interface BankAccountStats {
  total: number
  by_bank: Array<{
    bank_id: number
    bank_name: string
    count: number
  }>
  by_currency: Array<{
    currency_id: number
    currency_code: string
    count: number
  }>
}
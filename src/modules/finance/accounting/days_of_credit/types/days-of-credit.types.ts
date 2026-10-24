import type { Company } from "@companies/types/companies.types"

export interface DayOfCredit {
  id: number
  company: Company
  company_id?: number | null
  amount_in_days: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetDaysOfCreditParams {
  limit?: number
  offset?: number
  search?: string
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

export interface CreateDayOfCreditDTO {
  company_id?: number | null
  amount_in_days?: string | null
}

export interface UpdateDayOfCreditDTO {
  company_id?: number | null
  amount_in_days?: string | null
}

export interface DayOfCreditStats {
  total: number
  by_days: Array<{
    days: string
    count: number
  }>
}
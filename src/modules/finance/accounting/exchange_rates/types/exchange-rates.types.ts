import type { Company } from "@companies/types/companies.types"

export interface ExchangeRate {
  id: number
  company: Company
  company_id?: number | null
  amount_commercial: number | null
  amount_sunat: number | null
  amount_sbs: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetExchangeRatesParams {
  limit?: number
  offset?: number
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

export interface CreateExchangeRateDTO {
  company_id?: number | null
  amount_commercial?: number | null
  amount_sunat?: number | null
  amount_sbs?: number | null
}

export interface UpdateExchangeRateDTO {
  company_id?: number | null
  amount_commercial?: number | null
  amount_sunat?: number | null
  amount_sbs?: number | null
}

export interface ExchangeRateStats {
  total: number
  latest: ExchangeRate | null
  amount_commercial: number
  amount_sunat: number
  amount_sbs: number
}
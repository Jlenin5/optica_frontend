export interface Currency {
  id: number
  name: string
  description: string | null
  code: string
  symbol: string
  is_local: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetCurrenciesParams {
  limit?: number
  offset?: number
  search?: string
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateCurrencyDTO {
  name: string
  description?: string | null
  code: string
  symbol: string
  is_local: boolean
}

export interface UpdateCurrencyDTO {
  name?: string
  description?: string | null
  code?: string
  symbol?: string
  is_local: boolean
}

export interface CurrencyStats {
  total: number
}
export interface Tax {
  id: number
  code: string
  description?: string
  percent: number
  account: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetTaxesParams {
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

export interface CreateTaxDTO {
  code: string
  description?: string
  percent: number
  account?: string | null
}

export interface UpdateTaxDTO {
  code?: string
  description?: string
  percent?: number
  account?: string | null
}

export interface TaxStats {
  total: number
  active: number
  inactive: number
  active_percentage: number
  by_code: Array<{
    code: string
    count: number
  }>
}
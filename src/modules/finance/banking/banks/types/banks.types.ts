export interface Bank {
  id: number
  name: string
  description: string | null
  ruc: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetBanksParams {
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

export interface CreateBankDTO {
  company_id?: number | null
  name: string
  description?: string | null
  ruc?: string | null
}

export interface UpdateBankDTO {
  company_id?: number | null
  name?: string
  description?: string | null
  ruc?: string | null
}

export interface BankStats {
  total: number
  with_ruc: number
  without_ruc: number
}
export interface Receipt {
  id: number
  code: string
  description: string
  requires_sunat: boolean
  status: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: {
    id: number
    username: string
    email?: string
  } | null
  updated_by: {
    id: number
    username: string
    email?: string
  } | null
}

export interface GetReceiptsParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  date_from?: string
  date_to?: string
  requires_sunat?: boolean
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateReceiptDTO {
  code: string
  description: string
  requires_sunat: boolean
  status?: boolean
}

export interface UpdateReceiptDTO {
  code: string
  description?: string
  requires_sunat: boolean
  status?: boolean
}

export interface ReceiptStats {
  total: number
  active: number
  inactive: number
  last_30_days: number
}
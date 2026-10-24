export interface PaymentMethod {
  id: number
  description: string | null
  code: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetPaymentMethodsParams {
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

export interface CreatePaymentMethodDTO {
  description: string
  code?: string | null
}

export interface UpdatePaymentMethodDTO {
  description?: string
  code?: string | null
}

export interface PaymentMethodStats {
  total: number
  with_code: number
  without_code: number
}
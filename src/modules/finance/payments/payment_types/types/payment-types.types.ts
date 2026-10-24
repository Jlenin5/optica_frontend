export interface PaymentType {
  id: number
  description: string
  has_financing: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id?: number
  updated_by_id?: number
}

export interface GetPaymentTypesParams {
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

export interface CreatePaymentTypeDTO {
  company_id?: number | null
  description: string
  has_financing?: boolean
}

export interface UpdatePaymentTypeDTO {
  company_id?: number | null
  description?: string
  has_financing?: boolean
}

export interface PaymentTypeStats {
  total: number
  with_financing: number
  without_financing: number
}
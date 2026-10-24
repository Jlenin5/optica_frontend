export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

interface ErrorResponse {
  data?: {
    message: string
  }
}

export interface BackendErrorResponse {
  detail?: string
  response?: ErrorResponse
  error?: string
  code?: string
}
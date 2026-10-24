export interface Limit {
  id: number
  code: string
  name: string
}

export interface PlanLimit {
  id?: number
  plan_id: number
  limit_id: number
  value: number | null
  code?: string
  name?: string
  limit?: Limit
}

export interface GetLimitsParams {
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

export interface PlanWithLimits {
  plan_id: number
  plan_name: string
  plan_code: string
  limits: PlanLimit[]
}
export interface Feature {
  id: number
  code: string
  name: string
  description?: string
}

export interface PlanFeature {
  id: number
  plan_id: number
  feature_id: number
  code?: string
  name?: string
  description?: string
  feature?: Feature
}

export interface GetFeaturesParams {
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

export interface PlanWithFeatures {
  plan_id: number
  plan_name: string
  plan_code: string
  features: PlanFeature[]
}
export interface Brand {
  id: number
  name: string
  description: string | null
  image: string | null
  list_order: number
  website_url: string | null
  visible_on_web: boolean
  status: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by?: {
    id: number
    username: string
  }
  updated_by?: {
    id: number
    username: string
  }
}

export interface GetBrandsParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  visible_on_web?: boolean
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

export interface CreateBrandDTO {
  name: string
  description?: string | null
  image: string | null
  list_order?: number
  website_url?: string | null
  visible_on_web?: boolean
  status?: boolean
}

export interface UpdateBrandDTO {
  name?: string
  description?: string | null
  list_order?: number
  website_url?: string | null
  visible_on_web?: boolean
  status?: boolean
}

export interface BrandStats {
  total: number
  active: number
  inactive: number
  visible_on_web: number
  hidden_on_web: number
  with_website: number
  without_website: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}
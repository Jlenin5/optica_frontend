export interface Category {
  id: number
  name: string
  description: string | null
  image: string | null
  list_order: number
  category_father: number | null
  parent?: Category | null
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
  children?: Category[]
  level?: number
}

export interface GetCategoriesParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  visible_on_web?: boolean
  parent_id?: number | null
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

export interface CreateCategoryDTO {
  name: string
  description?: string | null
  list_order?: number
  category_father?: number | null
  visible_on_web?: boolean
  status?: boolean
}

export interface UpdateCategoryDTO {
  name?: string
  description?: string | null
  list_order?: number
  category_father?: number | null
  visible_on_web?: boolean
  status?: boolean
}

export interface CategoryStats {
  total: number
  active: number
  inactive: number
  visible_on_web: number
  hidden_on_web: number
  with_parent: number
  without_parent: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}
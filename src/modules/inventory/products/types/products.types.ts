import type { Company } from "@companies/types/companies.types"
import type { Category } from "@categories/types/categories.types"
import type { Brand } from "@brands/types/brands.types"

export type ProductType = 'product' | 'service' | 'lens'

export interface ProductImage {
  id: string
  url: string
  featured?: string | null
}

export interface Product {
  id: number
  company_id?: number | null
  company?: Company
  category_id: number | null
  category?: Category | null
  brand_id: number | null
  brand?: Brand | null
  sku: string | null
  barcode: string | null
  name: string
  handle: string | null
  description: string | null
  featured_image: string | null
  images: ProductImage[] | null
  product_type: ProductType
  cost: number
  price: number
  status: boolean
  total_stock?: number
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

export interface GetProductsParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  product_type?: ProductType
  category_id?: number
  brand_id?: number
  company_id?: number
  low_stock?: boolean
  min_price?: number
  max_price?: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateProductDTO {
  name: string
  product_type: ProductType
  price: number
  company_id?: number | null
  category_id?: number | null
  brand_id?: number | null
  sku?: string | null
  barcode?: string | null
  description?: string | null
  cost?: number
  status?: boolean
}

export interface UpdateProductDTO {
  name?: string
  product_type?: ProductType
  price?: number
  category_id?: number | null
  brand_id?: number | null
  sku?: string | null
  barcode?: string | null
  description?: string | null
  cost?: number
  status?: boolean
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  by_type: Array<{
    type: string
    label: string
    count: number
  }>
  low_stock: number
  out_of_stock: number
  total_value: number
}
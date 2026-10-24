import type { Company } from "@companies/types/companies.types"

export interface BranchOffice {
  id: number
  company_id?: number | null
  company?: Company
  name: string
  address: string | null
  phone: string | null
  status: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  created_by?: {
    id: number
    username: string
    email?: string
  }
  updated_by?: {
    id: number
    username: string
    email?: string
  }
}

export interface GetBranchOfficesParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
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

export interface CreateBranchOfficeDTO {
  company_id?: number | null
  name: string
  address?: string | null
  phone?: string | null
  status?: boolean
}

export interface UpdateBranchOfficeDTO {
  name?: string
  address?: string | null
  phone?: string | null
  status?: boolean
}

export interface BranchOfficeStats {
  total: number
  active: number
  inactive: number
  by_company: Array<{
    company_id?: number | null
    company_name: string
    count: number
  }>
}
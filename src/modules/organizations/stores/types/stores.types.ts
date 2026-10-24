import type { BranchOffice } from "@branch-offices/types/branch-offices.types"
import type { Company } from "../../companies/types/companies.types"

export interface Store {
  id: number
  company_id?: number | null
  company?: Company | null
  branch_office_id?: number | null
  branch_office?: BranchOffice
  name: string
  address: string | null
  phone: string | null
  status: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
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

export interface GetStoresParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  branch_office_id?: number | null
  company_id?: number // Para filtrar por empresa a través de sucursales
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateStoreDTO {
  company_id?: number | null
  branch_office_id?: number | null
  name: string
  address?: string | null
  phone?: string | null
  status?: boolean
}

export interface UpdateStoreDTO {
  name?: string
  company_id?: number | null
  branch_office_id?: number | null
  address?: string | null
  phone?: string | null
  status?: boolean
}

export interface StoreStats {
  total: number
  active: number
  inactive: number
  by_branch_office: Array<{
    branch_office_id?: number | null
    branch_office_name: string
    company_name: string
    count: number
  }>
  by_company: Array<{
    company_id?: number | null
    company_name: string
    count: number
  }>
}
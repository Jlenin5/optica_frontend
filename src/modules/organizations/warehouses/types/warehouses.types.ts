import type { Company } from "@companies/types/companies.types"
import type { BranchOffice } from "@branch-offices/types/branch-offices.types"

export interface Warehouse {
  id: number
  company_id?: number | null
  company?: Company | null
  branch_office_id: number | null
  branch_office?: BranchOffice | null
  company_or_branch_office: boolean // true: empresa, false: sucursal
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

export interface GetWarehousesParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  company_id?: number
  branch_office_id?: number
  type?: 'company' | 'branch_office' // true: empresa, false: sucursal
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateWarehouseDTO {
  name: string
  company_or_branch_office: boolean
  company_id?: number | null
  branch_office_id?: number | null
  address?: string | null
  phone?: string | null
  status?: boolean
}

export interface UpdateWarehouseDTO {
  name?: string
  address?: string | null
  phone?: string | null
  status?: boolean
}

export interface WarehouseStats {
  total: number
  active: number
  inactive: number
  by_company: Array<{
    company_id?: number | null
    company_name: string
    count: number
  }>
  by_branch_office: Array<{
    branch_office_id: number
    branch_office_name: string
    count: number
  }>
}
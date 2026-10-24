import type { Company } from "@companies/types/companies.types"
import type { BranchOffice } from "@branch-offices/types/branch-offices.types"
// import type { Employee } from "@employees/types/employees.types"
import type { Role } from "@roles/types/roles.types"

export interface User {
  id: number
  username: string
  email: string
  name?: string
  password?: string
  avatar?: string
  company_id?: number
  company?: Company
  branch_office_id?: number
  branch_id?: number
  branch_office?: BranchOffice
  employee_id?: number
  // employee?: Employee
  role_id?: number
  role?: Role
  roles?: Role[]
  permissions?: string[]
  permission_codes?: string[]
  status: boolean
  is_staff: boolean
  is_superuser: boolean
  created_at: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CreateUserDTO {
  email: string
  username: string
  password: string
  role_id?: number
  role_ids?: number[]
  company_id?: number
  branch_office_id?: number
  branch_id?: number
  employee_id?: number
  status?: boolean
  is_staff?: boolean
  is_superuser?: boolean
}

export interface UpdateUserDTO {
  email?: string
  username?: string
  password?: string
  role_id?: number
  role_ids?: number[]
  company_id?: number
  branch_office_id?: number
  branch_id?: number
  employee_id?: number
  status?: boolean
  is_staff?: boolean
  is_superuser?: boolean
}

export interface GetUsersParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  role_id?: number
  role_name?: string
  company_id?: number
  branch_office_id?: number
  branch_id?: number
  is_staff?: boolean
  is_superuser?: boolean
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  admins: number
  staff: number
  by_role: Array<{
    role_id: number
    role_name: string
    count: number
  }>
}
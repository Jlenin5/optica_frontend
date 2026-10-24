import type { Permission } from "@/modules/permissions/types/permissions.types"

export interface Role {
  id: number
  name: string
  description?: string
  status?: boolean
  company_id?: number | null
  company?: unknown
  permission_ids?: number[]
  permissions?: Permission[]
  created_by_id?: number
  updated_by_id?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface RolePayload {
  name: string
  description?: string
  status?: boolean
  company_id?: number | null
  permission_ids: number[]
}

export interface GetRolesParams {
  limit?: number
  offset?: number
  search?: string
}

export interface LoginResponse {
  user: {
    id: number
    username: string
    email: string
    avatar?: string
    status: boolean
    company?: {
      id: number
      name: string
      ruc: string
      email?: string
      phone?: string
      address?: string
      status: boolean
    }
    company_id?: number
    branch_office?: any
    branch_office_id?: number | null
    role?: {
      id: number
      name: string
      description?: string
    }
    role_id?: number
    roles?: Array<{ id: number; name: string; description?: string }>
    permissions?: string[]
    permission_codes?: string[]
    is_superuser: boolean
    is_staff: boolean
    created_at: string
    updated_at?: string
  }
  access_token: string
  refresh_token?: string
  roles?: Array<{ id: number; name: string; description?: string }>
  permissions?: string[]
  permission_codes?: string[]
  plan?: {
    id: number
    name: string
  }
  features?: string[]
  limits?: Record<string, number>
}
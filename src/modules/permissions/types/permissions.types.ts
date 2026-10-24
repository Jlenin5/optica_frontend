export interface Permission {
  id: number
  name: string
  code: string
  description?: string
  resource: string
  action: string
  status: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface EffectivePermissionsResponse {
  roles: Array<{ id: number; name: string; description?: string }>
  permissions: string[]
  is_superuser: boolean
}

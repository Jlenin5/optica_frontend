export interface Service {
  id: number
  company_id: number
  company?: { id: number; name: string; ruc?: string }
  code: string
  name: string
  description: string | null
  base_price: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ServiceDTO {
  company_id?: number
  code: string
  name: string
  description?: string | null
  base_price: number
  status?: boolean
}

export interface ServiceFilters {
  search?: string
  status?: boolean
  company_id?: number
  limit?: number
  offset?: number
}

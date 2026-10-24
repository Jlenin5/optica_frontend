export interface Laboratory {
  id: number
  company_id: number
  name: string
  trade_name: string | null
  tax_id: string | null
  email: string | null
  phone: string | null
  address: string | null
  contact_name: string | null
  notes: string | null
  status: boolean
  created_at: string
  updated_at: string
}
export interface LaboratoryDTO {
  company_id?: number | null
  name: string
  trade_name?: string | null
  tax_id?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  contact_name?: string | null
  notes?: string | null
  status?: boolean
}
export interface LaboratoryFilters { search?: string; status?: boolean; limit?: number; offset?: number }

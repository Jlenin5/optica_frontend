export type PurchaseStatus = 'Pendiente' | 'En proceso' | 'Completado' | 'Observado' | 'Cancelado'

export interface PurchaseFilters {
  search?: string
  status?: PurchaseStatus
  company_id?: number
  limit?: number
  offset?: number
}

export interface Purchase {
  id: number
  code: string
  supplier_name: string
  description?: string
  status: PurchaseStatus
  warehouse_id?: number
  warehouse_name?: string
  responsible_name?: string
  total?: number
  received_units?: number
  expected_date?: string
  company_id?: number
  created_at?: string
  updated_at?: string
}

export interface PurchaseDTO {
  supplier_name: string
  description?: string
  status?: PurchaseStatus
  warehouse_name?: string
  responsible_name?: string
  total?: number
  company_id?: number
}

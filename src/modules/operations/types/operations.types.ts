export type OperationalStatus =
  | 'Pendiente'
  | 'En proceso'
  | 'Observado'
  | 'Listo'
  | 'Completado'
  | 'Cancelado'
  | 'En tránsito'

export interface OperationFilters {
  search?: string
  status?: OperationalStatus
  company_id?: number
  limit?: number
  offset?: number
}

export interface Repair {
  id: number
  code: string
  customer_name: string
  item_name: string
  status: OperationalStatus
  technician_name?: string
  diagnosis?: string
  estimate_amount?: number
  notes?: string
  company_id?: number
  created_at?: string
  updated_at?: string
}

export interface RepairDTO {
  customer_name: string
  item_name: string
  status?: OperationalStatus
  technician_name?: string
  diagnosis?: string
  estimate_amount?: number
  notes?: string
  company_id?: number
}

export interface Delivery {
  id: number
  code: string
  customer_name: string
  sale_id?: number
  sale_reference?: string
  status: OperationalStatus
  store_name?: string
  delivery_method?: string
  balance_due?: number
  delivered_at?: string
  notes?: string
  company_id?: number
  created_at?: string
  updated_at?: string
}

export interface DeliveryDTO {
  customer_name: string
  sale_reference?: string
  status?: OperationalStatus
  store_name?: string
  delivery_method?: string
  balance_due?: number
  notes?: string
  company_id?: number
}

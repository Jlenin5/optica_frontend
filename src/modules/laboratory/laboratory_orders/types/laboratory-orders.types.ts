export type LaboratoryOrderStatus = 'PENDIENTE' | 'ENVIADO' | 'EN PROCESO' | 'LISTO' | 'RECIBIDO' | 'ENTREGADO' | 'CANCELADO'
export type Eye = 'OD' | 'OI'

export interface LaboratoryOrderDetail {
  id: number
  laboratory_order_id: number
  lens_type_id: number
  eye: Eye
  sale_detail_id: number | null
  quantity: number
  unit_price: string
  notes: string | null
  lens_type?: { id: number; code?: string; name: string; base_price?: string; features?: Array<{ id: number; name: string; type: string }> }
}

export interface LaboratoryOrder {
  id: number
  number?: string | null
  company_id: number
  company?: { id: number; name: string; ruc?: string }
  sale_id: number
  sale?: { id: number; series?: string | null; number?: number | null; document_code?: string | null }
  patient_id: number
  patient?: { id: number; first_name: string; last_name: string; document_number?: string }
  laboratory_id: number
  laboratory?: { id: number; name: string; trade_name?: string | null }
  prescription_id: number | null
  prescription?: { id: number; prescription_date?: string; source_type?: string }
  order_status_id: number
  order_status?: { id: number; name: string; code?: string; color?: string | null }
  order_date: string
  estimated_delivery_date: string | null
  delivered_at: string | null
  notes: string | null
  status: boolean
  created_at: string
  updated_at: string
  details: LaboratoryOrderDetail[]
}

export interface LaboratoryOrderDetailDTO {
  lens_type_id: number
  eye: Eye
  sale_detail_id?: number | null
  quantity: number
  unit_price: number
  notes?: string | null
}

export interface LaboratoryOrderDTO {
  company_id?: number
  sale_id: number
  patient_id: number
  laboratory_id: number
  prescription_id?: number | null
  order_status_id: number
  estimated_delivery_date?: string | null
  delivered_at?: string | null
  notes?: string | null
  status?: boolean
  details: LaboratoryOrderDetailDTO[]
}

export interface LaboratoryOrderFilters {
  company_id?: number
  sale_id?: number
  patient_id?: number
  laboratory_id?: number
  order_status_id?: number
  status?: boolean
  limit?: number
  offset?: number
}

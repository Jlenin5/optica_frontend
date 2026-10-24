import type { Patient } from "@/modules/clinical/patients/types/patients.types"
import type { Product } from "@/modules/inventory/products/types/products.types"

export type { Product }

// Tipo de línea de venta:
//  - 'catalog': referencia a un Product existente en el inventario (incluye
//    productos, lunas y servicios ya registrados, vía Product.product_type).
//  - 'custom': ítem libre sin registro en el catálogo (p. ej. un lente
//    personalizado hecho a medida). No tiene product_id; se describe con
//    custom_name / custom_description y su precio se ingresa manualmente.
export type SaleDetailItemType = 'catalog' | 'custom'

export interface Sale {
  id: number
  series: string | null
  number: number | null
  document_code: string | null
  reference_document: string | null
  receipt_id: number
  type_of_receipt_id: number
  company_id?: number | null
  warehouse_id: number | null
  store_id: number | null
  payment_type_id: number | null
  payment_method_id: number | null
  day_of_credit_id: number | null
  patient_id: number
  /** Cita clínica que originó la venta, si existe. */
  appointment_id?: number | null
  currency_id: number
  issue_date: string
  exchange_rate: string
  discount: string | null
  subtotal: string
  total: string
  total_paid: string
  change_amount: string
  sale_status_id: number
  status: boolean
  created_at: string
  updated_at: string
  created_by_id: number
  updated_by_id: number
  
  // Relaciones
  patient?: Patient
  currency?: Currency
  payment_method?: PaymentMethod
  payment_type?: PaymentType
  sale_status?: Status
  details?: SaleDetail[]
}

export interface SaleDetail {
  id: number
  sale_id: number
  item_type: SaleDetailItemType
  product_id: number | null
  service_id?: number | null
  lens_type_id?: number | null
  prescription_id?: number | null
  laboratory_id?: number | null
  eyes?: ('OD'|'OI')[]
  product_name: string | null
  // Solo aplican cuando item_type === 'custom'
  custom_name: string | null
  custom_description: string | null
  quantity: string
  price: string
  discount_method: boolean
  discount: string
  subtotal: string
  total: string
  status: boolean
  created_at: string
  updated_at: string
  
  // Relaciones
  product?: Product
}

// NOTA: el comprador de una venta es un Patient (unificado con el módulo
// clínico); ya no existe una entidad Customer separada para ventas.

export interface Currency {
  id: number
  code: string
  name: string
  symbol: string
}

export interface PaymentMethod {
  id: number
  description: string
  status: boolean
}

export interface PaymentType {
  id: number
  description: string
  status: boolean
}

export interface Status {
  id: number
  name: string
  color?: string
}

export interface CreateSaleDTO {
  receipt_id?: number | null
  company_id?: number | null
  warehouse_id?: number | null
  store_id?: number | null
  payment_type_id?: number | null
  payment_method_id?: number | null
  day_of_credit_id?: number | null
  patient_id: number
  /** Cita clínica que originó la venta, si existe. */
  appointment_id?: number | null
  currency_id: number
  exchange_rate?: number
  discount?: number | null
  subtotal: number
  total: number
  total_paid: number
  change_amount: number
  sale_status_id?: number | null
  details: CreateSaleDetailDTO[]
}

export interface CreateSaleDetailDTO {
  item_type: SaleDetailItemType
  // Requerido cuando item_type === 'catalog'
  product_id?: number | null
  service_id?: number | null
  lens_type_id?: number | null
  prescription_id?: number | null
  laboratory_id?: number | null
  eyes?: ('OD'|'OI')[]
  // Requeridos cuando item_type === 'custom' (ítem sin registro en catálogo,
  // p. ej. un lente personalizado hecho a medida)
  custom_name?: string | null
  custom_description?: string | null
  quantity: number
  price: number
  discount_method?: boolean
  discount?: number
  subtotal: number
  total: number
}

// Línea de venta mientras se arma en el formulario (antes de enviarse al
// backend). Además de los campos de CreateSaleDetailDTO, guarda el Product
// completo cuando el ítem viene del catálogo, para poder mostrar su
// nombre/tipo en la tabla sin depender de una lista de productos aparte.
export interface DraftSaleDetail extends CreateSaleDetailDTO {
  _product?: Product
  // Datos de visualización para servicios y lunas (no se envían al backend)
  _service?: { id: number; name: string; code?: string }
  _lens_type_name?: string
  _laboratory_name?: string
}

export interface SaleFilters {
  search?: string
  patient_id?: number
  appointment_id?: number
  sale_status_id?: number
  payment_method_id?: number
  date_from?: string
  date_to?: string
  company_id?: number | null
  store_id?: number
  limit?: number
  offset?: number
}

export interface SaleStats {
  total_sales: number
  total_amount: number
  average_ticket: number
  today_sales: number
  today_amount: number
  this_week_sales: number
  this_week_amount: number
  by_status: Array<{
    status_id: number
    status_name: string
    count: number
    total: number
  }>
  by_payment_method: Array<{
    payment_method_id: number
    payment_method_name: string
    count: number
    total: number
  }>
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
export type QuoteStatus =
  | 'Borrador'
  | 'Enviada'
  | 'Aceptada'
  | 'Rechazada'
  | 'Convertida'
  | 'Pedido'
  | 'Cancelado'
  | 'Vencida'

/**
 * Modalidad comercial del precio (snapshot).
 * En ópticas peruanas es habitual distinguir si el precio incluye IGV
 * (comprobante) o es precio de mostrador / convenio.
 */
export type PriceMode = 'PUBLICO' | 'CON_IGV' | 'SIN_IGV' | 'CONVENIO'

export interface QuoteLineItem {
  id?: number | string
  product_id?: number | null
  service_id?: number | null
  sku?: string
  name: string
  description?: string
  quantity: number
  unit_price: number
  discount: number
  discount_is_percent?: boolean
  subtotal: number
  product_type?: 'product' | 'lens' | 'service' | 'custom'
  /** Si el ítem requiere fabricación en laboratorio */
  requires_lab?: boolean
}

export interface Quote {
  id: number
  code: string
  company_id?: number
  patient_id?: number | null
  patient_name?: string
  customer_name?: string
  customer_document?: string
  warehouse_id?: number | null
  warehouse_name?: string
  store_id?: number | null
  store_name?: string
  seller_name?: string
  currency: 'PEN' | 'USD'
  price_mode: PriceMode
  /** @deprecated use price_mode */
  price_type?: string
  issue_date: string
  valid_until: string
  reference_document?: string
  prescription_id?: number | null
  subtotal: number
  discount: number
  tax_rate: number
  tax_amount: number
  total: number
  status: QuoteStatus
  notes?: string
  items_summary?: string
  items?: QuoteLineItem[]
  sale_id?: number | null
  laboratory_order_id?: number | null
  converted_at?: string
  created_at?: string
  updated_at?: string
}

export interface QuoteFilters {
  search?: string
  status?: QuoteStatus
  company_id?: number
  limit?: number
  offset?: number
}

export interface CreateQuoteDTO {
  patient_id?: number | null
  customer_name: string
  customer_document?: string
  warehouse_id?: number | null
  warehouse_name?: string
  currency: 'PEN' | 'USD'
  seller_name?: string
  price_mode: PriceMode
  issue_date: string
  valid_until: string
  reference_document?: string
  notes?: string
  status?: QuoteStatus
  discount?: number
  items: QuoteLineItem[]
  company_id?: number
}

export type QuoteAction =
  | 'send'
  | 'accept'
  | 'reject'
  | 'cancel'
  | 'convert_sale'
  | 'convert_order'

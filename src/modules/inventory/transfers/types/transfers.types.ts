export type TransferStatus = 'Pendiente' | 'En tránsito' | 'En proceso' | 'Completado' | 'Observado' | 'Cancelado'

export interface TransferFilters {
  search?: string
  status?: TransferStatus
  company_id?: number
  limit?: number
  offset?: number
}

export interface InventoryTransfer {
  id: number
  code: string
  origin_name?: string
  source_name?: string
  destination_name: string
  product_summary?: string
  quantity?: number
  status: TransferStatus
  responsible_name?: string
  items_count?: number
  detail?: string
  notes?: string
  company_id?: number
  created_at?: string
  updated_at?: string
}

export interface InventoryTransferDTO {
  source_name: string
  destination_name: string
  status?: TransferStatus
  responsible_name?: string
  items_count?: number
  detail?: string
  company_id?: number
}

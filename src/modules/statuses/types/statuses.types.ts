import type { Receipt } from "@/modules/documents/receipts/types/receipts.types"

export interface Status {
  id: number
  name: string
  code: string
  color: string | null
  is_default: boolean
  status?: boolean
  /**
   * Comprobantes asociados a este estado (relación N:N vía receipt_statuses).
   * El backend ya no expone un único `receipt`, sino la lista completa.
   */
  receipts?: Receipt[]
  /** IDs de los comprobantes asociados, útiles para precargar el formulario */
  receipt_ids?: number[]
  created_at: string
  updated_at?: string
  deleted_at?: string | null
  created_by_id?: number | null
  updated_by_id?: number | null
}

export interface CreateStatusDTO {
  code: string
  name: string
  color?: string | null
  is_default?: boolean
  /** IDs de los comprobantes a asociar a este estado (permite 0, 1 o varios) */
  receipt_ids?: number[]
}

export interface UpdateStatusDTO extends Partial<CreateStatusDTO> {}

export interface GetStatusesParams {
  limit?: number
  offset?: number
  search?: string
  is_default?: boolean
  status?: boolean
}

export interface StatusStats {
  total: number
  active: number
  inactive: number
  defaults: number
}

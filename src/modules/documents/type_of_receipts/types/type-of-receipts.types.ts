import type { Receipt } from "@receipts/types/receipts.types"
import type { Company } from "@companies/types/companies.types"

export interface TypeOfReceipt {
  id: number
  description: string | null
  receipt: Receipt | null
  receipt_id: number | null
  serie: string | null
  correlative: number | null
  company: Company | null
  company_id?: number | null
  status: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: {
    id: number
    username: string
    email?: string
  } | null
  updated_by: {
    id: number
    username: string
    email?: string
  } | null
}

export interface GetTypeOfReceiptsParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  receipt_id?: number
  company_id?: number
  date_from?: string
  date_to?: string
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateTypeOfReceiptDTO {
  description?: string | null
  receipt_id?: number | null
  serie?: string | null
  correlative?: number | null
  company_id?: number | null
  status?: boolean
}

export interface UpdateTypeOfReceiptDTO {
  description?: string | null
  receipt_id?: number | null
  serie?: string | null
  correlative?: number | null
  company_id?: number | null
  status?: boolean
}

export interface TypeOfReceiptStats {
  total: number
  active: number
  inactive: number
  by_company: Array<{
    company_id?: number | null
    company_name: string
    count: number
  }>
  by_receipt: Array<{
    receipt_id: number
    receipt_description: string
    count: number
  }>
}
import type { Company } from "@companies/types/companies.types"
import type { TypeOfDocument } from "@type-of-documents/types/type-of-documents.types"

export interface Patient {
  id: number
  company_id?: number | null
  company?: Company | null
  first_name: string
  last_name: string
  document_type_id: number
  document_type?: TypeOfDocument
  document_number: string
  phone: string
  email: string | null
  birth_date: string | null
  status: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by?: {
    id: number
    username: string
    email?: string
  }
  updated_by?: {
    id: number
    username: string
    email?: string
  }
}

export interface GetPatientsParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
  company_id?: number
  document_type_id?: number
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

export interface CreatePatientDTO {
  first_name: string
  last_name: string
  document_type_id: number
  document_number: string
  phone: string
  email?: string | null
  birth_date?: string | null
  company_id?: number | null
  status?: boolean
}

export interface UpdatePatientDTO {
  first_name?: string
  last_name?: string
  document_type_id?: number
  document_number?: string
  phone?: string
  email?: string | null
  birth_date?: string | null
  status?: boolean
}

export interface PatientStats {
  total: number
  active: number
  inactive: number
  by_document_type: Array<{
    document_type_id: number
    document_type_description: string
    count: number
  }>
  by_company: Array<{
    company_id?: number | null
    company_name: string
    count: number
  }>
  age_groups: {
    children: number // 0-12 años
    adolescents: number // 13-17 años
    adults: number // 18-59 años
    seniors: number // 60+ años
    unknown: number // sin fecha de nacimiento
  }
}
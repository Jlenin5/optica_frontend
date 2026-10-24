import type { Receipt } from "@/modules/documents/receipts/types/receipts.types"

export interface CompanySettings {
  id: number
  name: string
  ruc: string
  email?: string
  phone?: string
  address?: string
  logo?: string
  website?: string
  einvoice_username?: string
  einvoice_token?: string
  electronic_invoicing_provider?: string
  status: boolean
}

export interface NotificationSettings {
  email_notifications: boolean
  appointment_reminders: boolean
  appointment_reminder_hours: number
  invoice_notifications: boolean
  stock_alerts: boolean
  low_stock_threshold: number
  system_updates: boolean
  promotional_emails: boolean
}

export interface SecuritySettings {
  two_factor_auth: boolean
  session_timeout: number
  password_expiry_days: number
  login_attempts: number
  ip_restriction: boolean
  allowed_ips?: string[]
}

export interface InvoiceSettings {
  default_currency: string
  tax_rate: number
  invoice_prefix: string
  invoice_series: string
  footer_text?: string
  terms_conditions?: string
  logo_on_invoice: boolean
}

export interface GetSequencesParams {
  limit?: number
  offset?: number
  search?: string
}
export interface Sequence {
  id: number
  company: number
  branch_office: number | null
  receipt: Receipt
  receipt_id: number
  serie: string
  value: number
  padding: number
  status: boolean
  created_at: string
  updated_at: string
}

export interface SystemSettings {
  timezone: string
  date_format: string
  time_format: string
  language: string
  maintenance_mode: boolean
  maintenance_message?: string
}

export interface BranchOfficeSettings {
  id: number
  name: string
  address?: string
  phone?: string
  is_main: boolean
  status: boolean
}

export interface UpdateCompanySettingsDTO {
  name?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  einvoice_username?: string
  einvoice_token?: string
}

export interface UpdateNotificationSettingsDTO {
  email_notifications?: boolean
  appointment_reminders?: boolean
  appointment_reminder_hours?: number
  invoice_notifications?: boolean
  stock_alerts?: boolean
  low_stock_threshold?: number
  system_updates?: boolean
  promotional_emails?: boolean
}

export interface UpdateSecuritySettingsDTO {
  two_factor_auth?: boolean
  session_timeout?: number
  password_expiry_days?: number
  login_attempts?: number
  ip_restriction?: boolean
  allowed_ips?: string[]
}

export interface UpdateInvoiceSettingsDTO {
  default_currency?: string
  tax_rate?: number
  invoice_prefix?: string
  invoice_series?: string
  footer_text?: string
  terms_conditions?: string
  logo_on_invoice?: boolean
}

export interface CreateSequenceDTO {
  branch_office?: number | null
  receipt_id: number
  serie: string
  value: number
  padding: number
}

export interface UpdateSequenceDTO extends Partial<CreateSequenceDTO> {}

export interface UpdateSystemSettingsDTO {
  timezone?: string
  date_format?: string
  time_format?: string
  language?: string
  maintenance_mode?: boolean
  maintenance_message?: string
}
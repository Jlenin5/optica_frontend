import http from "@/services/http"
import type {
  CompanySettings,
  NotificationSettings,
  SecuritySettings,
  InvoiceSettings,
  SystemSettings,
  BranchOfficeSettings,
  UpdateCompanySettingsDTO,
  UpdateNotificationSettingsDTO,
  UpdateSecuritySettingsDTO,
  UpdateInvoiceSettingsDTO,
  UpdateSystemSettingsDTO,
  Sequence,
  UpdateSequenceDTO,
  CreateSequenceDTO,
  GetSequencesParams
} from "../types/settings.types"
import type { PaginatedResponse } from "@/types/global.types"

// Configuración de la empresa
export const getCompanySettings = async (): Promise<CompanySettings> => {
  try {
    const response = await http.get<CompanySettings>('/settings/company')
    return response.data
  } catch (error) {
    console.error('Error fetching company settings:', error)
    throw error
  }
}

export const updateCompanySettings = async (data: UpdateCompanySettingsDTO): Promise<CompanySettings> => {
  try {
    const response = await http.patch<CompanySettings>('/settings/company', data)
    return response.data
  } catch (error) {
    console.error('Error updating company settings:', error)
    throw error
  }
}

// Configuración de notificaciones
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const response = await http.get<NotificationSettings>('/settings/notifications')
    return response.data
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    throw error
  }
}

export const updateNotificationSettings = async (data: UpdateNotificationSettingsDTO): Promise<NotificationSettings> => {
  try {
    const response = await http.patch<NotificationSettings>('/settings/notifications', data)
    return response.data
  } catch (error) {
    console.error('Error updating notification settings:', error)
    throw error
  }
}

// Configuración de seguridad
export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  try {
    const response = await http.get<SecuritySettings>('/settings/security')
    return response.data
  } catch (error) {
    console.error('Error fetching security settings:', error)
    throw error
  }
}

export const updateSecuritySettings = async (data: UpdateSecuritySettingsDTO): Promise<SecuritySettings> => {
  try {
    const response = await http.patch<SecuritySettings>('/settings/security', data)
    return response.data
  } catch (error) {
    console.error('Error updating security settings:', error)
    throw error
  }
}

// Configuración de facturación
export const getInvoiceSettings = async (): Promise<InvoiceSettings> => {
  try {
    const response = await http.get<InvoiceSettings>('/settings/invoice')
    return response.data
  } catch (error) {
    console.error('Error fetching invoice settings:', error)
    throw error
  }
}

export const updateInvoiceSettings = async (data: UpdateInvoiceSettingsDTO): Promise<InvoiceSettings> => {
  try {
    const response = await http.patch<InvoiceSettings>('/settings/invoice', data)
    return response.data
  } catch (error) {
    console.error('Error updating invoice settings:', error)
    throw error
  }
}

// Configuración de secuencias
export const getSequences = async (params?: GetSequencesParams): Promise<PaginatedResponse<Sequence>> => {
  try {
    const response = await http.get<PaginatedResponse<Sequence>>('/sequences', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching sequences:', error)
    throw error
  }
}

export const createSequence = async (data: CreateSequenceDTO): Promise<Sequence> => {
  try {
    const response = await http.post<Sequence>('/sequences', data)
    return response.data
  } catch (error) {
    console.error('Error creating sequence:', error)
    throw error
  }
}

export const updateSequence = async (id: number, data: UpdateSequenceDTO): Promise<Sequence> => {
  try {
    const response = await http.patch<Sequence>(`/sequences/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating sequence:', error)
    throw error
  }
}

export const deleteSequence = async (id: number): Promise<Sequence> => {
  try {
    const response = await http.delete<Sequence>(`/sequences/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting sequence:', error)
    throw error
  }
}

// Configuración del sistema
export const getSystemSettings = async (): Promise<SystemSettings> => {
  try {
    const response = await http.get<SystemSettings>('/settings/system')
    return response.data
  } catch (error) {
    console.error('Error fetching system settings:', error)
    throw error
  }
}

export const updateSystemSettings = async (data: UpdateSystemSettingsDTO): Promise<SystemSettings> => {
  try {
    const response = await http.patch<SystemSettings>('/settings/system', data)
    return response.data
  } catch (error) {
    console.error('Error updating system settings:', error)
    throw error
  }
}

// Sucursales
export const getBranchOffices = async (): Promise<BranchOfficeSettings[]> => {
  try {
    const response = await http.get<BranchOfficeSettings[]>('/settings/branch-offices')
    return response.data
  } catch (error) {
    console.error('Error fetching branch offices:', error)
    throw error
  }
}

export const createBranchOffice = async (data: Partial<BranchOfficeSettings>): Promise<BranchOfficeSettings> => {
  try {
    const response = await http.post<BranchOfficeSettings>('/settings/branch-offices', data)
    return response.data
  } catch (error) {
    console.error('Error creating branch office:', error)
    throw error
  }
}

export const updateBranchOffice = async (id: number, data: Partial<BranchOfficeSettings>): Promise<BranchOfficeSettings> => {
  try {
    const response = await http.patch<BranchOfficeSettings>(`/settings/branch-offices/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating branch office:', error)
    throw error
  }
}

export const deleteBranchOffice = async (id: number): Promise<void> => {
  try {
    await http.delete(`/settings/branch-offices/${id}`)
  } catch (error) {
    console.error('Error deleting branch office:', error)
    throw error
  }
}

// Upload logo
export const uploadCompanyLogo = async (file: File): Promise<{ logo: string }> => {
  try {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await http.post<{ logo: string }>('/settings/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading logo:', error)
    throw error
  }
}
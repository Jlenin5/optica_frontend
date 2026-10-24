// modules/companies/api/companies.api.ts
import http from "@/services/http"
import type { 
  Company,
  GetCompaniesParams
} from "../types/companies.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getCompanies = async (params?: GetCompaniesParams): Promise<PaginatedResponse<Company>> => {
  try {
    const url = '/companies'
    const response = await http.get<PaginatedResponse<Company>>(url, {
      params: {
        limit: params?.limit || 10,
        offset: params?.offset || 0,
        search: params?.search
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching companies:', error)
    throw error
  }
}

export const getCompanyById = async (id: number): Promise<Company> => {
  try {
    const response = await http.get<Company>(`/companies/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error)
    throw error
  }
}

export const createCompany = async (data: Company): Promise<Company> => {
  try {
    const response = await http.post<Company>('/companies', data)
    return response.data
  } catch (error) {
    console.error('Error creating company:', error)
    throw error
  }
}

export const updateCompany = async (id: number, data: Company): Promise<Company> => {
  try {
    const response = await http.patch<Company>(`/companies/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating company ${id}:`, error)
    throw error
  }
}

export const deleteCompany = async (id: number): Promise<void> => {
  try {
    await http.delete(`/companies/${id}`)
  } catch (error) {
    console.error(`Error deleting company ${id}:`, error)
    throw error
  }
}

export const toggleCompanyStatus = async (id: number, status: boolean): Promise<Company> => {
  try {
    const response = await http.patch<Company>(`/companies/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling company status ${id}:`, error)
    throw error
  }
}

export const uploadCompanyLogo = async (id: number, file: File): Promise<{ logo: string }> => {
  try {
    const formData = new FormData()
    formData.append('logo', file)
    
    const response = await http.post<{ logo: string }>(`/companies/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error uploading logo for company ${id}:`, error)
    throw error
  }
}

export const validateRuc = async (ruc: string): Promise<{ valid: boolean; companyName?: string }> => {
  try {
    const response = await http.get<{ valid: boolean; companyName?: string }>(`/companies/validate-ruc/${ruc}`)
    return response.data
  } catch (error) {
    console.error('Error validating RUC:', error)
    throw error
  }
}
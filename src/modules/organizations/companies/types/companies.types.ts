export interface Company {
  id: number
  name: string
  logo?: string
  ruc: string
  email?: string
  phone: string
  web_site?: string
  address?: string
  einvoice_username?: string
  einvoice_token?: string
  status: boolean
}

export interface GetCompaniesParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
}
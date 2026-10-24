import http from '@/services/http'
import type { Laboratory, LaboratoryDTO, LaboratoryFilters } from '../types/laboratories.types'
import type { PaginatedResponse } from '../../common'

export const getLaboratories = async (params: Record<string, unknown> = {}) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => v !== undefined && v !== '' && q.append(k, String(v)))
  const r = await http.get<PaginatedResponse<Laboratory>>(`/laboratories${q.toString() ? `?${q}` : ''}`); return r.data
}
export const getLaboratory = async (id:number) => (await http.get<Laboratory>(`/laboratories/${id}`)).data
export const createLaboratory = async (data:LaboratoryDTO) => (await http.post<Laboratory>('/laboratories',data)).data
export const updateLaboratory = async (id:number,data:Partial<LaboratoryDTO>) => (await http.patch<Laboratory>(`/laboratories/${id}`,data)).data
export const deleteLaboratory = async (id:number) => { await http.delete(`/laboratories/${id}`) }

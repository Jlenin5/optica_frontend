import http from '@/services/http'
import type {PaginatedResponse} from '@/types/global.types'
import type {LaboratoryQuality,LaboratoryQualityDTO,QualityFilters} from '../types/laboratory-quality.types'
export const getQualityControls=async(params:QualityFilters={})=>(await http.get<PaginatedResponse<LaboratoryQuality>>('/laboratory-quality',{params})).data
export const createQualityControl=async(data:LaboratoryQualityDTO)=>(await http.post<LaboratoryQuality>('/laboratory-quality',data)).data
export const updateQualityControl=async(id:number,data:Partial<LaboratoryQualityDTO>)=>(await http.patch<LaboratoryQuality>(`/laboratory-quality/${id}`,data)).data
export const deleteQualityControl=async(id:number)=>{await http.delete(`/laboratory-quality/${id}`)}

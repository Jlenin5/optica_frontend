import http from '@/services/http'
import type { LensFeature, LensFeatureDTO, LensType, LensTypeDTO } from '../types/lens-types.types'
import type { PaginatedResponse } from '../../common'
const query=(p:Record<string,unknown>)=>{const q=new URLSearchParams();Object.entries(p).forEach(([k,v])=>v!==undefined&&v!==''&&q.append(k,String(v)));return q.toString()?`?${q}`:''}
export const getLensFeatures=async(p:Record<string,unknown>={})=>(await http.get<PaginatedResponse<LensFeature>|LensFeature[]>(`/lens-features${query(p)}`)).data
export const createLensFeature=async(d:LensFeatureDTO)=>(await http.post<LensFeature>('/lens-features',d)).data
export const updateLensFeature=async(id:number,d:Partial<LensFeatureDTO>)=>(await http.patch<LensFeature>(`/lens-features/${id}`,d)).data
export const deleteLensFeature=async(id:number)=>{await http.delete(`/lens-features/${id}`)}
export const getLensTypes=async(p:Record<string,unknown>={})=>(await http.get<PaginatedResponse<LensType>|LensType[]>(`/lens-types${query(p)}`)).data
export const getLensType=async(id:number)=>(await http.get<LensType>(`/lens-types/${id}`)).data
export const createLensType=async(d:LensTypeDTO)=>(await http.post<LensType>('/lens-types',d)).data
export const updateLensType=async(id:number,d:Partial<LensTypeDTO>)=>(await http.patch<LensType>(`/lens-types/${id}`,d)).data
export const deleteLensType=async(id:number)=>{await http.delete(`/lens-types/${id}`)}

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createLaboratory, deleteLaboratory, getLaboratories, updateLaboratory } from './api/laboratories.api'
import { useAuthStore } from '@/app/store/auth.store'
import type { LaboratoryDTO } from './types/laboratories.types'

export const useLaboratories = (filters: Record<string, unknown> = {}) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  const company = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  return useInfiniteQuery({ queryKey:['laboratories',{...filters,...company}], queryFn:({pageParam=0})=>getLaboratories({...filters,...company,offset:pageParam,limit:10}), initialPageParam:0, getNextPageParam:p=>(p as any).has_more ? (p as any).next_offset : undefined })
}
export const useCreateLaboratory=()=>{const qc=useQueryClient();return useMutation({mutationFn:(d:LaboratoryDTO)=>createLaboratory(d),onSuccess:()=>qc.invalidateQueries({queryKey:['laboratories']})})}
export const useUpdateLaboratory=()=>{const qc=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number,data:Partial<LaboratoryDTO>})=>updateLaboratory(id,data),onSuccess:()=>qc.invalidateQueries({queryKey:['laboratories']})})}
export const useDeleteLaboratory=()=>{const qc=useQueryClient();return useMutation({mutationFn:(id:number)=>deleteLaboratory(id),onSuccess:()=>qc.invalidateQueries({queryKey:['laboratories']})})}

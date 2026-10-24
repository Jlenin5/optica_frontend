import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query'
import {notification} from '@/services/notification'
import {createQualityControl,deleteQualityControl,getQualityControls,updateQualityControl} from '../api/laboratory-quality.api'
import type {LaboratoryQualityDTO,QualityFilters} from '../types/laboratory-quality.types'
export const useLaboratoryQuality=(filters:QualityFilters={})=>useQuery({queryKey:['laboratory-quality',filters],queryFn:()=>getQualityControls(filters)})
export const useCreateQualityControl=()=>{const q=useQueryClient();return useMutation({mutationFn:(d:LaboratoryQualityDTO)=>createQualityControl(d),onSuccess:()=>{q.invalidateQueries({queryKey:['laboratory-quality']});notification.success('Control de calidad registrado')}})}
export const useUpdateQualityControl=()=>{const q=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number;data:Partial<LaboratoryQualityDTO>})=>updateQualityControl(id,data),onSuccess:()=>q.invalidateQueries({queryKey:['laboratory-quality']})})}
export const useDeleteQualityControl=()=>{const q=useQueryClient();return useMutation({mutationFn:deleteQualityControl,onSuccess:()=>q.invalidateQueries({queryKey:['laboratory-quality']})})}

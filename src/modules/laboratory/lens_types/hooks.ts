import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import {createLensFeature,createLensType,deleteLensFeature,deleteLensType,getLensFeatures,getLensTypes,updateLensFeature,updateLensType} from './api/lens-types.api'
import type {LensFeatureDTO,LensTypeDTO} from './types/lens-types.types'
export const useLensFeatures=(p:Record<string,unknown>={})=>useQuery({queryKey:['lens-features',p],queryFn:()=>getLensFeatures(p)})
export const useLensTypes=(p:Record<string,unknown>={})=>useQuery({queryKey:['lens-types',p],queryFn:()=>getLensTypes(p)})
export const useCreateLensFeature=()=>{const q=useQueryClient();return useMutation({mutationFn:(d:LensFeatureDTO)=>createLensFeature(d),onSuccess:()=>q.invalidateQueries({queryKey:['lens-features']})})}
export const useUpdateLensFeature=()=>{const q=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number,data:Partial<LensFeatureDTO>})=>updateLensFeature(id,data),onSuccess:()=>q.invalidateQueries({queryKey:['lens-features']})})}
export const useDeleteLensFeature=()=>{const q=useQueryClient();return useMutation({mutationFn:(id:number)=>deleteLensFeature(id),onSuccess:()=>q.invalidateQueries({queryKey:['lens-features']})})}
export const useCreateLensType=()=>{const q=useQueryClient();return useMutation({mutationFn:(d:LensTypeDTO)=>createLensType(d),onSuccess:()=>q.invalidateQueries({queryKey:['lens-types']})})}
export const useUpdateLensType=()=>{const q=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number,data:Partial<LensTypeDTO>})=>updateLensType(id,data),onSuccess:()=>q.invalidateQueries({queryKey:['lens-types']})})}
export const useDeleteLensType=()=>{const q=useQueryClient();return useMutation({mutationFn:(id:number)=>deleteLensType(id),onSuccess:()=>q.invalidateQueries({queryKey:['lens-types']})})}

import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import { notification } from '@/services/notification'
import { createPurchase,deletePurchase,getPurchases,updatePurchase } from '../api/purchases.api'
import type { PurchaseDTO,PurchaseFilters } from '../types/purchases.types'
export const usePurchases=(filters:PurchaseFilters={})=>useQuery({queryKey:['purchases',filters],queryFn:()=>getPurchases(filters)})
export const useCreatePurchase=()=>{const q=useQueryClient();return useMutation({mutationFn:(d:PurchaseDTO)=>createPurchase(d),onSuccess:()=>{q.invalidateQueries({queryKey:['purchases']});notification.success('Compra registrada correctamente')}})}
export const useUpdatePurchase=()=>{const q=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number;data:Partial<PurchaseDTO>})=>updatePurchase(id,data),onSuccess:()=>q.invalidateQueries({queryKey:['purchases']})})}
export const useDeletePurchase=()=>{const q=useQueryClient();return useMutation({mutationFn:deletePurchase,onSuccess:()=>q.invalidateQueries({queryKey:['purchases']})})}

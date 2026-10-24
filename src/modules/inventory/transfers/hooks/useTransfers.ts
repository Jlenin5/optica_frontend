import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query'
import {notification} from '@/services/notification'
import {createTransfer,deleteTransfer,getTransfers,updateTransfer} from '../api/transfers.api'
import type {InventoryTransferDTO,TransferFilters} from '../types/transfers.types'
export const useTransfers=(filters:TransferFilters={})=>useQuery({queryKey:['inventory-transfers',filters],queryFn:()=>getTransfers(filters)})
export const useCreateTransfer=()=>{const q=useQueryClient();return useMutation({mutationFn:(d:InventoryTransferDTO)=>createTransfer(d),onSuccess:()=>{q.invalidateQueries({queryKey:['inventory-transfers']});notification.success('Transferencia registrada correctamente')}})}
export const useUpdateTransfer=()=>{const q=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number;data:Partial<InventoryTransferDTO>})=>updateTransfer(id,data),onSuccess:()=>q.invalidateQueries({queryKey:['inventory-transfers']})})}
export const useDeleteTransfer=()=>{const q=useQueryClient();return useMutation({mutationFn:deleteTransfer,onSuccess:()=>q.invalidateQueries({queryKey:['inventory-transfers']})})}

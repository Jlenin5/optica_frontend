import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from '@/services/notification'
import { createDelivery, createRepair, deleteDelivery, deleteRepair, getDeliveries, getRepairs, updateDelivery, updateRepair } from '../api/operations.api'
import type { DeliveryDTO, OperationFilters, RepairDTO } from '../types/operations.types'

export const useRepairs = (filters: OperationFilters = {}) => useQuery({ queryKey: ['repairs', filters], queryFn: () => getRepairs(filters) })
export const useCreateRepair = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(data:RepairDTO)=>createRepair(data), onSuccess:()=>{qc.invalidateQueries({queryKey:['repairs']}); notification.success('Reparación registrada correctamente')}, onError:()=>notification.error('No se pudo registrar la reparación') }) }
export const useUpdateRepair = () => { const qc=useQueryClient(); return useMutation({ mutationFn:({id,data}:{id:number;data:Partial<RepairDTO>})=>updateRepair(id,data), onSuccess:()=>qc.invalidateQueries({queryKey:['repairs']}) }) }
export const useDeleteRepair = () => { const qc=useQueryClient(); return useMutation({ mutationFn:deleteRepair, onSuccess:()=>qc.invalidateQueries({queryKey:['repairs']}) }) }

export const useDeliveries = (filters: OperationFilters = {}) => useQuery({ queryKey: ['deliveries', filters], queryFn: () => getDeliveries(filters) })
export const useCreateDelivery = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(data:DeliveryDTO)=>createDelivery(data), onSuccess:()=>{qc.invalidateQueries({queryKey:['deliveries']}); notification.success('Entrega registrada correctamente')}, onError:()=>notification.error('No se pudo registrar la entrega') }) }
export const useUpdateDelivery = () => { const qc=useQueryClient(); return useMutation({ mutationFn:({id,data}:{id:number;data:Partial<DeliveryDTO>})=>updateDelivery(id,data), onSuccess:()=>qc.invalidateQueries({queryKey:['deliveries']}) }) }
export const useDeleteDelivery = () => { const qc=useQueryClient(); return useMutation({ mutationFn:deleteDelivery, onSuccess:()=>qc.invalidateQueries({queryKey:['deliveries']}) }) }

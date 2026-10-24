import http from '@/services/http'
import type { PaginatedResponse } from '@/types/global.types'
import type { InventoryTransfer,InventoryTransferDTO,TransferFilters } from '../types/transfers.types'
export const getTransfers=async(params:TransferFilters={})=>(await http.get<PaginatedResponse<InventoryTransfer>>('/inventory-transfers',{params})).data
export const createTransfer=async(data:InventoryTransferDTO)=>(await http.post<InventoryTransfer>('/inventory-transfers',data)).data
export const updateTransfer=async(id:number,data:Partial<InventoryTransferDTO>)=>(await http.patch<InventoryTransfer>(`/inventory-transfers/${id}`,data)).data
export const deleteTransfer=async(id:number)=>{await http.delete(`/inventory-transfers/${id}`)}

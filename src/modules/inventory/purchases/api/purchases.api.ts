import http from '@/services/http'
import type { PaginatedResponse } from '@/types/global.types'
import type { Purchase, PurchaseDTO, PurchaseFilters } from '../types/purchases.types'
export const getPurchases = async (params:PurchaseFilters={}) => (await http.get<PaginatedResponse<Purchase>>('/purchases',{params})).data
export const createPurchase = async (data:PurchaseDTO) => (await http.post<Purchase>('/purchases',data)).data
export const updatePurchase = async (id:number,data:Partial<PurchaseDTO>) => (await http.patch<Purchase>(`/purchases/${id}`,data)).data
export const deletePurchase = async (id:number) => { await http.delete(`/purchases/${id}`) }

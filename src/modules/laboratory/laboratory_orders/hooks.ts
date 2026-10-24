import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLaboratoryOrder, getLaboratoryOrder, getLaboratoryOrders, updateLaboratoryOrder } from './api/laboratory-orders.api'
import type { LaboratoryOrderDTO, LaboratoryOrderFilters } from './types/laboratory-orders.types'
import { notification } from '@/services/notification'

export const useLaboratoryOrders = (filters: LaboratoryOrderFilters = {}) => useQuery({ queryKey: ['laboratory-orders', filters], queryFn: () => getLaboratoryOrders(filters), staleTime: 60 * 1000 })
export const useLaboratoryOrder = (id: number | null) => useQuery({ queryKey: ['laboratory-orders', id], queryFn: () => getLaboratoryOrder(id as number), enabled: !!id })

export const useCreateLaboratoryOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LaboratoryOrderDTO) => createLaboratoryOrder(data),
    onSuccess: data => { queryClient.invalidateQueries({ queryKey: ['laboratory-orders'] }); notification.success(`Orden de laboratorio #${data.id} creada correctamente`) },
    onError: (error: any) => notification.error(error?.response?.data?.detail || error?.response?.data?.message || 'No se pudo crear la orden de laboratorio'),
  })
}

export const useUpdateLaboratoryOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LaboratoryOrderDTO> }) => updateLaboratoryOrder(id, data),
    onSuccess: data => { queryClient.invalidateQueries({ queryKey: ['laboratory-orders'] }); queryClient.invalidateQueries({ queryKey: ['laboratory-orders', data.id] }); notification.success(`Orden #${data.id} actualizada correctamente`) },
    onError: (error: any) => notification.error(error?.response?.data?.detail || error?.response?.data?.message || 'No se pudo actualizar la orden de laboratorio'),
  })
}

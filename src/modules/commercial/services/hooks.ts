import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createService, deleteService, getService, getServices, updateService } from './api/services.api'
import type { ServiceDTO, ServiceFilters } from './types/services.types'
import { notification } from '@/services/notification'

export const useServices = (filters: ServiceFilters = {}) =>
  useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
    staleTime: 5 * 60 * 1000,
  })

export const useService = (id: number | null) =>
  useQuery({
    queryKey: ['services', id],
    queryFn: () => getService(id as number),
    enabled: !!id,
  })

export const useCreateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ServiceDTO) => createService(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      notification.success(`Servicio "${data.name}" creado correctamente`)
    },
    onError: (error: any) => {
      notification.error(error?.response?.data?.detail || error?.response?.data?.message || 'No se pudo crear el servicio')
    },
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ServiceDTO> }) => updateService(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['services', data.id] })
      notification.success(`Servicio "${data.name}" actualizado correctamente`)
    },
    onError: (error: any) => {
      notification.error(error?.response?.data?.detail || error?.response?.data?.message || 'No se pudo actualizar el servicio')
    },
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      notification.success('Servicio eliminado correctamente')
    },
    onError: (error: any) => {
      notification.error(error?.response?.data?.detail || error?.response?.data?.message || 'No se pudo eliminar el servicio')
    },
  })
}

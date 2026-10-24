import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from '@/services/notification'
import {
  createQuote,
  deleteQuote,
  getQuote,
  getQuotes,
  performQuoteAction,
  updateQuote,
} from '../api/quotes.api'
import type {
  CreateQuoteDTO,
  QuoteAction,
  QuoteFilters,
  QuoteStatus,
} from '../types/quote.types'

export const useQuotes = (filters: QuoteFilters = {}) =>
  useQuery({
    queryKey: ['quotes', filters],
    queryFn: () => getQuotes(filters),
  })

export const useQuote = (id: number | undefined) =>
  useQuery({
    queryKey: ['quotes', id],
    queryFn: () => getQuote(id!),
    enabled: !!id && id > 0,
  })

export const useCreateQuote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuoteDTO) => createQuote(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
      notification.success('Cotización guardada correctamente')
    },
    onError: () => notification.error('No se pudo guardar la cotización'),
  })
}

export const useUpdateQuote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<CreateQuoteDTO> & { status?: QuoteStatus }
    }) => updateQuote(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
      notification.success('Cotización actualizada')
    },
    onError: () => notification.error('No se pudo actualizar la cotización'),
  })
}

export const useDeleteQuote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteQuote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
      notification.success('Cotización eliminada')
    },
  })
}

export const useQuoteAction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: QuoteAction }) =>
      performQuoteAction(id, action),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
      if (vars.action === 'convert_sale') {
        qc.invalidateQueries({ queryKey: ['sales'] })
        qc.invalidateQueries({ queryKey: ['stock'] })
        qc.invalidateQueries({ queryKey: ['deliveries'] })
        qc.invalidateQueries({ queryKey: ['laboratory-orders'] })
      }
      if (vars.action === 'convert_order') {
        qc.invalidateQueries({ queryKey: ['orders'] })
        qc.invalidateQueries({ queryKey: ['laboratory-orders'] })
      }
      const messages: Record<QuoteAction, string> = {
        send: 'Cotización marcada como enviada',
        accept: 'Cotización aceptada por el cliente',
        reject: 'Cotización rechazada',
        cancel: 'Cotización cancelada',
        convert_sale: 'Venta creada desde la cotización',
        convert_order: 'Pedido creado desde la cotización',
      }
      notification.success(messages[vars.action])
    },
    onError: (error: unknown) => {
      const candidate = error as { response?: { data?: { detail?: string; message?: string } }; message?: string }
      const message =
        candidate.response?.data?.detail ||
        candidate.response?.data?.message ||
        candidate.message ||
        'No se pudo realizar la acción'
      notification.error(`No se pudo completar la operación: ${message}`)
    },
  })
}

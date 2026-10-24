import http from '@/services/http'
import type { PaginatedResponse } from '@/types/global.types'
import type {
  CreateQuoteDTO,
  Quote,
  QuoteAction,
  QuoteFilters,
  QuoteStatus,
} from '../types/quote.types'

export const getQuotes = async (params: QuoteFilters = {}) =>
  (await http.get<PaginatedResponse<Quote>>('/quotes', { params })).data

export const getQuote = async (id: number) =>
  (await http.get<Quote>(`/quotes/${id}`)).data

export const createQuote = async (data: CreateQuoteDTO) =>
  (await http.post<Quote>('/quotes', data)).data

export const updateQuote = async (id: number, data: Partial<CreateQuoteDTO> & { status?: QuoteStatus }) =>
  (await http.patch<Quote>(`/quotes/${id}`, data)).data

export const deleteQuote = async (id: number) => {
  await http.delete(`/quotes/${id}`)
}

export interface QuoteActionResult {
  quote: Quote
  sale?: { id: number; document_code?: string; total?: number }
  order?: { id: number; code?: string }
  laboratory_order?: { id: number; code?: string }
  delivery?: { id: number; code?: string }
}

/**
 * Las conversiones son comandos de negocio independientes: no se simulan
 * cambiando únicamente el estado de la cotización.
 *
 * El backend debe implementar POST /quotes/:id/convert-sale y
 * POST /quotes/:id/convert-order como operaciones transaccionales e idempotentes.
 */
export const performQuoteAction = async (
  id: number,
  action: QuoteAction,
): Promise<QuoteActionResult> => {
  if (action === 'convert_sale') {
    return (await http.post<QuoteActionResult>(`/quotes/${id}/convert-sale`, {})).data
  }
  if (action === 'convert_order') {
    return (await http.post<QuoteActionResult>(`/quotes/${id}/convert-order`, {})).data
  }

  const statusByAction: Partial<Record<QuoteAction, QuoteStatus>> = {
    send: 'Enviada',
    accept: 'Aceptada',
    reject: 'Rechazada',
    cancel: 'Cancelado',
  }
  const status = statusByAction[action]
  if (!status) throw new Error('Acción de cotización no soportada')

  const quote = (await http.patch<Quote>(`/quotes/${id}`, {
    status,
  })).data
  return { quote }
}

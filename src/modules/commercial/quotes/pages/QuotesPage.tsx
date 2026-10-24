import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import {
  useQuotes,
  useDeleteQuote,
  useQuoteAction,
} from '../hooks/useQuotes'
import { ROUTES } from '@/app/config/routes'
import type { Quote, QuoteAction, QuoteStatus } from '../types/quote.types'
import '@/styles/components/_operational.scss'
import '@/styles/quotes.scss'

const STATUS_OPTIONS: Array<'Todos' | QuoteStatus> = [
  'Todos',
  'Borrador',
  'Pendiente',
  'Enviada',
  'Aceptada',
  'Pedido',
  'Convertida',
  'Rechazada',
  'Cancelado',
  'Vencida',
]

const demoFallback: Quote[] = [
  {
    id: 18,
    code: 'COT-2026-018',
    customer_name: 'María García',
    items_summary: 'Montura + 2 opciones de lentes',
    status: 'Aceptada',
    seller_name: 'Ana / Ventas',
    total: 1280,
    currency: 'PEN',
    price_mode: 'CON_IGV',
    issue_date: '2026-10-10',
    valid_until: '2026-10-25',
    subtotal: 1084.75,
    discount: 0,
    tax_rate: 0.18,
    tax_amount: 195.25,
    items: [
      {
        id: 1,
        name: 'Montura Premium',
        quantity: 1,
        unit_price: 320,
        discount: 0,
        subtotal: 320,
        product_type: 'product',
      },
      {
        id: 2,
        name: 'Lente progresivo',
        quantity: 2,
        unit_price: 380,
        discount: 0,
        subtotal: 760,
        product_type: 'lens',
        requires_lab: true,
      },
    ],
  },
  {
    id: 17,
    code: 'COT-2026-017',
    customer_name: 'Carlos Rodríguez',
    items_summary: 'Montura + progresivos',
    status: 'Enviada',
    seller_name: 'Luis / Ventas',
    total: 1890,
    currency: 'PEN',
    price_mode: 'PUBLICO',
    issue_date: '2026-10-08',
    valid_until: '2026-10-22',
    subtotal: 1890,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
  },
  {
    id: 16,
    code: 'COT-2026-016',
    customer_name: 'Lucía Flores',
    items_summary: 'Lentes monofocales',
    status: 'Borrador',
    seller_name: 'Ana / Ventas',
    total: 450,
    currency: 'PEN',
    price_mode: 'SIN_IGV',
    issue_date: '2026-10-05',
    valid_until: '2026-10-20',
    subtotal: 450,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
  },
]

const statusClass = (s: string) => s.toLowerCase().replaceAll(' ', '-')

/** Acciones permitidas según estado (flujo típico de óptica) */
function availableActions(status: QuoteStatus): QuoteAction[] {
  switch (status) {
    case 'Borrador':
    case 'Pendiente':
      return ['send', 'cancel']
    case 'Enviada':
      return ['accept', 'reject', 'cancel']
    case 'Aceptada':
      return ['convert_sale', 'convert_order', 'cancel']
    case 'Pedido':
      return ['convert_sale']
    default:
      return []
  }
}

const ACTION_LABEL: Record<QuoteAction, string> = {
  send: 'Marcar enviada',
  accept: 'Cliente aceptó',
  reject: 'Rechazar',
  cancel: 'Cancelar',
  convert_sale: 'Convertir a venta',
  convert_order: 'Generar pedido (lab)',
}

const ACTION_ICON: Record<QuoteAction, string> = {
  send: 'send',
  accept: 'check_circle',
  reject: 'cancel',
  cancel: 'block',
  convert_sale: 'point_of_sale',
  convert_order: 'science',
}

export const QuotesPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'Todos' | QuoteStatus>('Todos')
  const [menuId, setMenuId] = useState<number | null>(null)
  const { data, isLoading } = useQuotes({ limit: 100 })
  const deleteMutation = useDeleteQuote()
  const actionMutation = useQuoteAction()

  const quotes: Quote[] = useMemo(() => {
    const fromApi =
      (data as any)?.results ||
      (Array.isArray(data) ? data : null) ||
      []
    if (fromApi.length > 0) return fromApi as Quote[]
    return demoFallback
  }, [data])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return quotes.filter((item) => {
      const text =
        `${item.code} ${item.customer_name || item.patient_name || ''} ${item.items_summary || ''} ${item.seller_name || ''}`.toLowerCase()
      const matchSearch = !q || text.includes(q)
      const matchStatus = status === 'Todos' || item.status === status
      return matchSearch && matchStatus
    })
  }, [quotes, search, status])

  const stats = useMemo(() => {
    const total = quotes.length
    const abiertas = quotes.filter((q) =>
      ['Borrador', 'Pendiente', 'Enviada', 'Aceptada'].includes(q.status),
    ).length
    const convertidas = quotes.filter((q) =>
      ['Convertida', 'Pedido'].includes(q.status),
    ).length
    return { total, abiertas, convertidas }
  }, [quotes])

  const runAction = (quote: Quote, action: QuoteAction) => {
    setMenuId(null)
    actionMutation.mutate(
      { id: quote.id, action },
      {
        onSuccess: () => {
          // Tras convertir, llevar al flujo comercial/laboratorio
          if (action === 'convert_sale') {
            try {
              sessionStorage.setItem(
                'optica-quote-to-sale',
                JSON.stringify({
                  quote_id: quote.id,
                  customer_name: quote.customer_name || quote.patient_name,
                  patient_id: quote.patient_id,
                  items: quote.items,
                  total: quote.total,
                  currency: quote.currency,
                  notes: quote.notes,
                }),
              )
            } catch {
              /* ignore */
            }
            navigate(ROUTES.CREATE_SALE)
          }
          if (action === 'convert_order') {
            try {
              sessionStorage.setItem(
                'optica-quote-to-lab',
                JSON.stringify({
                  quote_id: quote.id,
                  customer_name: quote.customer_name || quote.patient_name,
                  patient_id: quote.patient_id,
                  items: quote.items,
                  notes: quote.notes,
                }),
              )
            } catch {
              /* ignore */
            }
            navigate(ROUTES.LABORATORY_ORDERS)
          }
        },
      },
    )
  }

  const canEdit = (s: QuoteStatus) =>
    !['Convertida', 'Pedido', 'Cancelado', 'Rechazada'].includes(s)

  return (
    <section className="operational-page quotes-page">
      <header className="operational-page__header">
        <div>
          <div className="operational-page__eyebrow">Comercial</div>
          <h1>Cotizaciones</h1>
          <p>
            Cotiza monturas y lentes, envía al cliente, acepta y convierte a
            venta o a pedido de laboratorio.
          </p>
        </div>
        <div className="operational-page__actions">
          <button
            type="button"
            className="operational-btn operational-btn--primary"
            onClick={() => navigate(ROUTES.CREATE_QUOTE)}
          >
            <MuiSvgIcon name="add" />
            Nueva cotización
          </button>
        </div>
      </header>

      <div className="operational-kpis">
        <div>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <span>Abiertas</span>
          <strong>{stats.abiertas}</strong>
        </div>
        <div>
          <span>Convertidas / pedido</span>
          <strong>{stats.convertidas}</strong>
        </div>
      </div>

      <div className="operational-toolbar">
        <div className="operational-search">
          <MuiSvgIcon name="search" />
          <input
            type="search"
            placeholder="Buscar por código, cliente o vendedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          aria-label="Filtrar por estado"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>
          {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="operational-table-wrap">
        {isLoading ? (
          <div className="quotes-page__loading">Cargando cotizaciones…</div>
        ) : (
          <table className="operational-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Detalle</th>
                <th>Vendedor</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="quotes-page__empty">
                    No hay cotizaciones con esos filtros.
                  </td>
                </tr>
              )}
              {filtered.map((q) => {
                const actions = availableActions(q.status)
                return (
                  <tr key={q.id}>
                    <td>
                      <strong>{q.code || `COT-${q.id}`}</strong>
                    </td>
                    <td>
                      {q.customer_name || q.patient_name || '—'}
                      {q.customer_document && (
                        <small>{q.customer_document}</small>
                      )}
                    </td>
                    <td>
                      {q.items_summary || `${q.items?.length || 0} ítems`}
                    </td>
                    <td>{q.seller_name || '—'}</td>
                    <td>
                      {q.currency === 'USD' ? 'US$' : 'S/'}{' '}
                      {Number(q.total || 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`operational-status operational-status--${statusClass(q.status)}`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td>
                      <div className="quotes-page__actions">
                        {canEdit(q.status) && (
                          <button
                            type="button"
                            title="Editar"
                            onClick={() =>
                              navigate(
                                ROUTES.EDIT_QUOTE.replace(
                                  ':id',
                                  String(q.id),
                                ),
                              )
                            }
                          >
                            <MuiSvgIcon name="edit" />
                          </button>
                        )}
                        {!canEdit(q.status) && (
                          <button
                            type="button"
                            title="Ver"
                            onClick={() =>
                              navigate(
                                ROUTES.EDIT_QUOTE.replace(
                                  ':id',
                                  String(q.id),
                                ),
                              )
                            }
                          >
                            <MuiSvgIcon name="visibility" />
                          </button>
                        )}

                        <div className="quotes-page__menu-wrap">
                          <button
                            type="button"
                            title="Más acciones"
                            onClick={() =>
                              setMenuId(menuId === q.id ? null : q.id)
                            }
                          >
                            <MuiSvgIcon name="more_vert" />
                          </button>
                          {menuId === q.id && (
                            <div className="quotes-page__menu">
                              {actions.map((action) => (
                                <button
                                  key={action}
                                  type="button"
                                  className={
                                    action === 'convert_sale' ||
                                    action === 'convert_order'
                                      ? 'is-primary'
                                      : action === 'cancel' ||
                                          action === 'reject'
                                        ? 'is-danger'
                                        : ''
                                  }
                                  onClick={() => runAction(q, action)}
                                  disabled={actionMutation.isPending}
                                >
                                  <MuiSvgIcon name={ACTION_ICON[action]} />
                                  {ACTION_LABEL[action]}
                                </button>
                              ))}
                              {actions.length === 0 && (
                                <span className="quotes-page__menu-empty">
                                  Sin acciones disponibles
                                </span>
                              )}
                              {['Borrador', 'Pendiente', 'Cancelado'].includes(
                                q.status,
                              ) && (
                                <button
                                  type="button"
                                  className="is-danger"
                                  onClick={() => {
                                    setMenuId(null)
                                    if (confirm('¿Eliminar esta cotización?')) {
                                      deleteMutation.mutate(q.id)
                                    }
                                  }}
                                >
                                  <MuiSvgIcon name="delete" />
                                  Eliminar
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {menuId !== null && (
        <button
          type="button"
          className="quotes-page__menu-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuId(null)}
        />
      )}
    </section>
  )
}

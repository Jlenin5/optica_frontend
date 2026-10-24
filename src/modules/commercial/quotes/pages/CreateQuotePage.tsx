import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import { usePatients } from '@/modules/clinical/patients/hooks/usePatients'
import { useProducts } from '@/modules/inventory/products/hooks/useProducts'
import {
  useCreateQuote,
  useQuote,
  useUpdateQuote,
} from '../hooks/useQuotes'
import type { PriceMode, QuoteLineItem, QuoteStatus } from '../types/quote.types'
import { ROUTES } from '@/app/config/routes'
import { useAuthStore } from '@/app/store/auth.store'
import '@/styles/quotes-form.scss'
// import '@/styles/modules/quotes.scss'

const today = () => new Date().toISOString().slice(0, 10)
const plusDays = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const IGV_RATE = 0.18

const PRICE_MODES: { id: PriceMode; label: string; hint: string }[] = [
  { id: 'PUBLICO', label: 'Precio público', hint: 'Lista de precio de mostrador' },
  { id: 'CON_IGV', label: 'Con comprobante', hint: 'Incluye IGV 18%' },
  { id: 'SIN_IGV', label: 'Sin comprobante', hint: 'Precio neto / boleta simple' },
  { id: 'CONVENIO', label: 'Convenio / empresa', hint: 'Tarifa especial o corporativa' },
]

const LOCKED_STATUSES: QuoteStatus[] = ['Convertida', 'Pedido', 'Cancelado', 'Rechazada']

export const CreateQuotePage = () => {
  const navigate = useNavigate()
  const { id: idParam } = useParams()
  const quoteId = idParam ? Number(idParam) : undefined
  const isEditing = !!quoteId && !Number.isNaN(quoteId)

  const { user } = useAuthStore()
  const createMutation = useCreateQuote()
  const updateMutation = useUpdateQuote()
  const { data: existing, isLoading: loadingQuote } = useQuote(quoteId)

  const [customerName, setCustomerName] = useState('')
  const [customerDocument, setCustomerDocument] = useState('')
  const [patientId, setPatientId] = useState<number | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [showPatientList, setShowPatientList] = useState(false)

  const [warehouseName, setWarehouseName] = useState('Almacén principal')
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN')
  const [sellerName, setSellerName] = useState(
    user?.name || user?.username || 'Vendedor',
  )
  const [priceMode, setPriceMode] = useState<PriceMode>('PUBLICO')
  const [issueDate, setIssueDate] = useState(today())
  const [validUntil, setValidUntil] = useState(plusDays(15))
  const [referenceDocument, setReferenceDocument] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<QuoteStatus>('Borrador')
  const [globalDiscount, setGlobalDiscount] = useState(0)
  const [items, setItems] = useState<QuoteLineItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  const [productSearch, setProductSearch] = useState('')
  const [showProductList, setShowProductList] = useState(false)

  useEffect(() => {
    if (!existing || hydrated) return
    setCustomerName(existing.customer_name || existing.patient_name || '')
    setCustomerDocument(existing.customer_document || '')
    setPatientId(existing.patient_id ?? null)
    setWarehouseName(existing.warehouse_name || 'Almacén principal')
    setCurrency(existing.currency || 'PEN')
    setSellerName(existing.seller_name || user?.name || 'Vendedor')
    const mode =
      existing.price_mode ||
      (existing.price_type === 'CF'
        ? 'CON_IGV'
        : existing.price_type === 'SF'
          ? 'SIN_IGV'
          : existing.price_type === 'BOX'
            ? 'CONVENIO'
            : 'PUBLICO')
    setPriceMode(mode as PriceMode)
    setIssueDate(existing.issue_date?.slice(0, 10) || today())
    setValidUntil(existing.valid_until?.slice(0, 10) || plusDays(15))
    setReferenceDocument(existing.reference_document || '')
    setNotes(existing.notes || '')
    setStatus(existing.status || 'Borrador')
    setGlobalDiscount(Number(existing.discount) || 0)
    setItems(existing.items || [])
    setHydrated(true)
  }, [existing, hydrated, user])

  const readOnly = isEditing && LOCKED_STATUSES.includes(status)

  const { data: patientsData } = usePatients({
    search: patientSearch || undefined,
  })
  const patients =
    patientsData?.pages?.flatMap((p) => p.results) ||
    (patientsData as any)?.results ||
    []

  const { data: productsData } = useProducts({
    search: productSearch || undefined,
  })
  const products =
    productsData?.pages?.flatMap((p) => p.results) ||
    (productsData as any)?.results ||
    []

  const includesTax = priceMode === 'CON_IGV'

  const totals = useMemo(() => {
    const linesSubtotal = items.reduce((s, it) => s + it.subtotal, 0)
    const discount = Math.min(globalDiscount, linesSubtotal)
    const base = Math.max(0, linesSubtotal - discount)
    const tax = includesTax ? Number((base * IGV_RATE).toFixed(2)) : 0
    const total = Number((base + tax).toFixed(2))
    return {
      productsCount: items.reduce((s, it) => s + it.quantity, 0),
      subtotal: Number(linesSubtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      tax,
      total,
    }
  }, [items, globalDiscount, includesTax])

  const money = (n: number) =>
    `${currency === 'PEN' ? 'S/' : 'US$'} ${n.toFixed(2)}`

  const selectPatient = (p: any) => {
    setPatientId(p.id)
    setCustomerName(
      `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.name || 'Cliente',
    )
    setCustomerDocument(p.document_number || p.document || '')
    setPatientSearch('')
    setShowPatientList(false)
  }

  const addProduct = (product: any) => {
    if (readOnly) return
    const price = Number(product.price) || 0
    const type = product.product_type || product.type || 'product'
    const line: QuoteLineItem = {
      id: `tmp-${Date.now()}-${product.id}`,
      product_id: product.id,
      sku: product.sku || product.code,
      name: product.name,
      description: product.description || '',
      quantity: 1,
      unit_price: price,
      discount: 0,
      discount_is_percent: false,
      subtotal: price,
      product_type: type,
      requires_lab: type === 'lens',
    }
    setItems((prev) => [...prev, line])
    setProductSearch('')
    setShowProductList(false)
  }

  const updateLine = (
    id: string | number | undefined,
    patch: Partial<QuoteLineItem>,
  ) => {
    if (readOnly) return
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        const next = { ...it, ...patch }
        const raw = next.quantity * next.unit_price
        const disc = next.discount_is_percent
          ? (raw * (next.discount || 0)) / 100
          : next.discount || 0
        next.subtotal = Number(Math.max(0, raw - disc).toFixed(2))
        return next
      }),
    )
  }

  const removeLine = (id: string | number | undefined) => {
    if (readOnly) return
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const saving = createMutation.isPending || updateMutation.isPending
  const canSave =
    !readOnly &&
    customerName.trim().length > 0 &&
    items.length > 0 &&
    !saving

  const buildPayload = () => ({
    patient_id: patientId,
    customer_name: customerName.trim(),
    customer_document: customerDocument || undefined,
    warehouse_name: warehouseName,
    currency,
    seller_name: sellerName,
    price_mode: priceMode,
    issue_date: issueDate,
    valid_until: validUntil,
    reference_document: referenceDocument || undefined,
    notes: notes || undefined,
    status: status === 'Borrador' || status === 'Pendiente' ? status : status,
    discount: globalDiscount,
    items,
  })

  const handleSave = (asStatus?: QuoteStatus) => {
    if (!canSave && !asStatus) return
    const payload = {
      ...buildPayload(),
      status: asStatus || (isEditing ? status : 'Borrador'),
    }
    if (isEditing && quoteId) {
      updateMutation.mutate(
        { id: quoteId, data: payload },
        { onSuccess: () => navigate(ROUTES.QUOTES) },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate(ROUTES.QUOTES),
      })
    }
  }

  if (isEditing && loadingQuote) {
    return (
      <div className="sale-form-page quote-form-page">
        <p className="quote-form-page__loading">Cargando cotización…</p>
      </div>
    )
  }

  return (
    <div className="quote-form-page">
      <header className="sale-form-page__header">
        <button
          type="button"
          className="sale-form-page__back-btn"
          onClick={() => navigate(ROUTES.QUOTES)}
          aria-label="Volver"
        >
          <MuiSvgIcon size={20}>lucide:arrow-left</MuiSvgIcon>
        </button>
        <div>
          <div className="quote-form-page__eyebrow">
            {isEditing ? `Cotización · ${existing?.code || `#${quoteId}`}` : 'Nueva cotización'}
          </div>
          <h1 className="sale-form-page__title">
            {readOnly
              ? 'Ver cotización'
              : isEditing
                ? 'Editar cotización'
                : 'Crear cotización'}
          </h1>
        </div>
        {isEditing && (
          <span className={`quote-form-page__status-pill quote-form-page__status-pill--${status.toLowerCase()}`}>
            {status}
          </span>
        )}
      </header>

      {readOnly && (
        <div className="quote-form-page__readonly-banner">
          Esta cotización está en estado <strong>{status}</strong> y no admite
          cambios de ítems. Puedes usar las acciones desde el listado (venta / pedido).
        </div>
      )}

      <div className="sale-form">
        <div className="sale-form__container">
          <div className="sale-form__main">
            <section className="sale-form__section">
              <h2 className="sale-form__section-title">
                <MuiSvgIcon name="person" />
                Información de la cotización
              </h2>

              <div className="quote-form-page__grid-4">
                <div className="sale-form__field quote-form-page__field-relative">
                  <label>
                    Cliente <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName || patientSearch}
                    disabled={readOnly}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      setPatientSearch(e.target.value)
                      setPatientId(null)
                      setShowPatientList(true)
                    }}
                    onFocus={() => setShowPatientList(true)}
                    placeholder="Busca por nombre, empresa o documento"
                    autoComplete="off"
                  />
                  {showPatientList && !readOnly && patientSearch.length >= 1 && (
                    <ul className="quote-form-page__dropdown">
                      {patients.length === 0 && (
                        <li className="quote-form-page__dropdown-empty">
                          Sin resultados — puedes escribir el nombre libremente
                        </li>
                      )}
                      {patients.slice(0, 8).map((p: any) => (
                        <li key={p.id}>
                          <button type="button" onClick={() => selectPatient(p)}>
                            <strong>
                              {p.first_name} {p.last_name}
                            </strong>
                            <span>{p.document_number}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="sale-form__field">
                  <label>
                    Almacén / tienda <span className="required">*</span>
                  </label>
                  <select
                    value={warehouseName}
                    disabled={readOnly}
                    onChange={(e) => setWarehouseName(e.target.value)}
                  >
                    <option>Almacén principal</option>
                    <option>Almacén Centro</option>
                    <option>Tienda Miraflores</option>
                    <option>Tienda San Isidro</option>
                    <option>Tienda Surco</option>
                  </select>
                </div>

                <div className="sale-form__field">
                  <label>Moneda</label>
                  <select
                    value={currency}
                    disabled={readOnly}
                    onChange={(e) => setCurrency(e.target.value as 'PEN' | 'USD')}
                  >
                    <option value="PEN">S/ · PEN</option>
                    <option value="USD">US$ · USD</option>
                  </select>
                </div>

                <div className="sale-form__field">
                  <label>Vendedor</label>
                  <input
                    type="text"
                    value={sellerName}
                    disabled={readOnly}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="quote-form-page__grid-3">
                <div className="sale-form__field">
                  <label>Fecha de emisión</label>
                  <input
                    type="date"
                    value={issueDate}
                    disabled={readOnly}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="sale-form__field">
                  <label>Válida hasta</label>
                  <input
                    type="date"
                    value={validUntil}
                    disabled={readOnly}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
                <div className="sale-form__field">
                  <label>Documento de referencia</label>
                  <input
                    type="text"
                    value={referenceDocument}
                    disabled={readOnly}
                    onChange={(e) => setReferenceDocument(e.target.value)}
                    placeholder="Receta, proforma, N° de cita…"
                  />
                </div>
              </div>
            </section>

            <section className="sale-form__section">
              <div className="quote-form-page__price-type-header">
                <h2
                  className="sale-form__section-title"
                  style={{ margin: 0, border: 0, padding: 0 }}
                >
                  Modalidad de precio
                </h2>
                <span className="quote-form-page__price-hint">
                  Se guarda como snapshot: no cambia si luego actualizas la lista de precios.
                </span>
              </div>
              <div className="quote-form-page__price-types quote-form-page__price-types--4">
                {PRICE_MODES.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    disabled={readOnly}
                    className={`quote-form-page__price-card ${
                      priceMode === pt.id ? 'is-active' : ''
                    }`}
                    onClick={() => setPriceMode(pt.id)}
                  >
                    <span className="quote-form-page__price-label">{pt.label}</span>
                    <span className="quote-form-page__price-sub">{pt.hint}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="sale-form__section">
              <div className="quote-form-page__products-toolbar">
                <div
                  className="sale-form__field quote-form-page__field-relative"
                  style={{ flex: 1 }}
                >
                  <label>Agregar producto / lente / servicio</label>
                  <div className="quote-form-page__product-search">
                    <MuiSvgIcon name="search" />
                    <input
                      type="text"
                      value={productSearch}
                      disabled={readOnly}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setShowProductList(true)
                      }}
                      onFocus={() => setShowProductList(true)}
                      placeholder="Escribe nombre o SKU..."
                      autoComplete="off"
                    />
                  </div>
                  {showProductList && !readOnly && productSearch.length >= 1 && (
                    <ul className="quote-form-page__dropdown quote-form-page__dropdown--wide">
                      {products.length === 0 && (
                        <li className="quote-form-page__dropdown-empty">
                          No se encontraron productos
                        </li>
                      )}
                      {products.slice(0, 10).map((p: any) => (
                        <li key={p.id}>
                          <button type="button" onClick={() => addProduct(p)}>
                            <div>
                              <strong>{p.name}</strong>
                              <span className="quote-form-page__sku">
                                {p.sku || p.code} · {p.product_type || p.type || 'producto'}
                              </span>
                            </div>
                            <span className="quote-form-page__price">
                              S/ {Number(p.price || 0).toFixed(2)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="quote-form-page__products-count">
                  {items.length} ítem{items.length !== 1 ? 's' : ''}
                </div>
              </div>

              {items.length === 0 ? (
                <div className="quote-form-page__empty-products">
                  <MuiSvgIcon name="inventory_2" />
                  <p>Aún no hay productos</p>
                  <span>Busca monturas, lentes o servicios y agrégalos a la cotización.</span>
                </div>
              ) : (
                <div className="quote-form-page__lines">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>P. unit.</th>
                        <th>Desc.</th>
                        <th>Subtotal</th>
                        {!readOnly && <th></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it) => (
                        <tr key={String(it.id)}>
                          <td>
                            <strong>{it.name}</strong>
                            {it.sku && (
                              <span className="quote-form-page__sku">{it.sku}</span>
                            )}
                            {it.requires_lab && (
                              <span className="quote-form-page__lab-tag">Lab</span>
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              disabled={readOnly}
                              value={it.quantity}
                              onChange={(e) =>
                                updateLine(it.id, {
                                  quantity: Math.max(1, Number(e.target.value) || 1),
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              disabled={readOnly}
                              value={it.unit_price}
                              onChange={(e) =>
                                updateLine(it.id, {
                                  unit_price: Number(e.target.value) || 0,
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              disabled={readOnly}
                              value={it.discount}
                              onChange={(e) =>
                                updateLine(it.id, {
                                  discount: Number(e.target.value) || 0,
                                })
                              }
                            />
                          </td>
                          <td>{money(it.subtotal)}</td>
                          {!readOnly && (
                            <td>
                              <button
                                type="button"
                                className="quote-form-page__remove"
                                onClick={() => removeLine(it.id)}
                                aria-label="Quitar"
                              >
                                <MuiSvgIcon name="delete" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="sale-form__notes-card">
              <label>Notas / condiciones comerciales</label>
              <textarea
                rows={3}
                disabled={readOnly}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alternativas de lentes, plazos de entrega, garantía…"
              />
            </section>
          </div>

          <aside className="sale-form__sidebar">
            <div className="sale-form__section quote-form-page__summary">
              <h3>Resumen</h3>
              <div className="quote-form-page__summary-company">
                Óptica Demo · {currency}
              </div>

              <div className="quote-form-page__summary-price-label">
                {PRICE_MODES.find((p) => p.id === priceMode)?.label}
              </div>

              <div className="sale-form__total-row">
                <span>Ítems</span>
                <strong>{totals.productsCount}</strong>
              </div>
              <div className="sale-form__total-row">
                <span>Subtotal</span>
                <strong>{money(totals.subtotal)}</strong>
              </div>
              <div className="sale-form__total-row">
                <span>Descuento</span>
                <div className="quote-form-page__discount-input">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={readOnly}
                    value={globalDiscount}
                    onChange={(e) => setGlobalDiscount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              {includesTax && (
                <div className="sale-form__total-row">
                  <span>IGV (18%)</span>
                  <strong>{money(totals.tax)}</strong>
                </div>
              )}
              <div className="sale-form__total-row sale-form__total-row--grand">
                <span>Total cotizado</span>
                <strong>{money(totals.total)}</strong>
              </div>
              {includesTax && (
                <div className="quote-form-page__igv-tag">CON IGV</div>
              )}
              {priceMode === 'SIN_IGV' && (
                <div className="quote-form-page__igv-tag is-sf">SIN IGV</div>
              )}

              <div className="quote-form-page__validity">
                <MuiSvgIcon name="event" />
                Vigencia hasta{' '}
                {validUntil
                  ? new Date(validUntil + 'T12:00:00').toLocaleDateString('es-PE')
                  : '—'}
              </div>
            </div>

            <div className="quote-form-page__actions quote-form-page__actions--stack">
              <button
                type="button"
                className="quote-form-page__btn-secondary"
                onClick={() => navigate(ROUTES.QUOTES)}
              >
                {readOnly ? 'Volver' : 'Cancelar'}
              </button>
              {!readOnly && (
                <>
                  <button
                    type="button"
                    className="quote-form-page__btn-secondary"
                    disabled={!canSave}
                    onClick={() => handleSave('Borrador')}
                  >
                    Guardar borrador
                  </button>
                  <button
                    type="button"
                    className="quote-form-page__btn-primary"
                    disabled={!canSave}
                    onClick={() => handleSave(isEditing ? status : 'Pendiente')}
                  >
                    {saving
                      ? 'Guardando…'
                      : isEditing
                        ? 'Actualizar cotización'
                        : 'Guardar cotización'}
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

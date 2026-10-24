import type { QuoteDraft } from '../types/quote.types'
export const QuoteForm = ({ value, onChange }: { value: QuoteDraft; onChange: (value: QuoteDraft) => void }) => <>
  <label>Cliente<input autoFocus value={value.customer} onChange={e=>onChange({...value,customer:e.target.value})} placeholder="Buscar cliente" /></label>
  <label>Vigencia (días)<input type="number" min="1" value={value.validity_days} onChange={e=>onChange({...value,validity_days:Number(e.target.value)})} /></label>
  <label>Moneda<select value={value.currency} onChange={e=>onChange({...value,currency:e.target.value as QuoteDraft['currency']})}><option value="PEN">Sol peruano (PEN)</option><option value="USD">Dólar estadounidense (USD)</option></select></label>
  <label>Ítems / productos<textarea value={value.items} onChange={e=>onChange({...value,items:e.target.value})} placeholder="Producto, lente, servicio, cantidad..." /></label>
  <label>Subtotal<input type="number" min="0" step="0.01" value={value.subtotal} onChange={e=>onChange({...value,subtotal:Number(e.target.value)})} /></label>
  <label>Descuento<input type="number" min="0" step="0.01" value={value.discount} onChange={e=>onChange({...value,discount:Number(e.target.value)})} /></label>
  <label>Notas<textarea value={value.notes} onChange={e=>onChange({...value,notes:e.target.value})} /></label>
  <label>Estado<select value={value.status} onChange={e=>onChange({...value,status:e.target.value as QuoteDraft['status']})}><option>Pendiente</option><option>Completado</option><option>Cancelado</option></select></label>
</>

import type { DeliveryDTO } from '../types/operations.types'
export interface DeliveryFormProps { value: DeliveryDTO; onChange: (value: DeliveryDTO) => void }
export const DeliveryForm = ({ value, onChange }: DeliveryFormProps) => <>
  <label>Cliente<input autoFocus value={value.customer_name} onChange={e=>onChange({...value,customer_name:e.target.value})} /></label>
  <label>Venta / orden<input value={value.sale_reference ?? ''} onChange={e=>onChange({...value,sale_reference:e.target.value})} placeholder="V-0000 / LAB-0000" /></label>
  <label>Tienda de entrega<input value={value.store_name ?? ''} onChange={e=>onChange({...value,store_name:e.target.value})} /></label>
  <label>Modalidad<select value={value.delivery_method ?? ''} onChange={e=>onChange({...value,delivery_method:e.target.value})}><option value="">Seleccionar</option><option>Recojo en tienda</option><option>Despacho a domicilio</option><option>Envío por courier</option></select></label>
  <label>Saldo pendiente (S/)<input type="number" min="0" step="0.01" value={value.balance_due ?? ''} onChange={e=>onChange({...value,balance_due:e.target.value?Number(e.target.value):undefined})} /></label>
  <label>Observaciones<textarea value={value.notes ?? ''} onChange={e=>onChange({...value,notes:e.target.value})} /></label>
</>

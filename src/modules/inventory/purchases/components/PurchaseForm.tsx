import type { PurchaseDTO } from '../types/purchases.types'
export const PurchaseForm=({value,onChange}:{value:PurchaseDTO;onChange:(v:PurchaseDTO)=>void})=><>
  <label>Proveedor<input autoFocus value={value.supplier_name} onChange={e=>onChange({...value,supplier_name:e.target.value})} placeholder="Buscar proveedor" /></label>
  <label>Almacén de recepción<input value={value.warehouse_name??''} onChange={e=>onChange({...value,warehouse_name:e.target.value})} placeholder="Almacén destino" /></label>
  <label>Descripción de compra<textarea value={value.description??''} onChange={e=>onChange({...value,description:e.target.value})} placeholder="Productos, lentes, accesorios..." /></label>
  <label>Responsable<input value={value.responsible_name??''} onChange={e=>onChange({...value,responsible_name:e.target.value})} /></label>
  <label>Total (S/)<input type="number" min="0" step="0.01" value={value.total??''} onChange={e=>onChange({...value,total:e.target.value?Number(e.target.value):undefined})} /></label>
  <label>Estado<select value={value.status??'Pendiente'} onChange={e=>onChange({...value,status:e.target.value as PurchaseDTO['status']})}><option>Pendiente</option><option>En proceso</option><option>Completado</option><option>Cancelado</option></select></label>
</>

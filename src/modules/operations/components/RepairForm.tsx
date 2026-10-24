import type { RepairDTO } from '../types/operations.types'
export interface RepairFormProps { value: RepairDTO; onChange: (value: RepairDTO) => void }
export const RepairForm = ({ value, onChange }: RepairFormProps) => <>
  <label>Cliente<input autoFocus value={value.customer_name} onChange={e=>onChange({...value,customer_name:e.target.value})} placeholder="Buscar cliente" /></label>
  <label>Artículo recibido<input value={value.item_name} onChange={e=>onChange({...value,item_name:e.target.value})} placeholder="Montura, lentes, accesorio..." /></label>
  <label>Técnico responsable<input value={value.technician_name ?? ''} onChange={e=>onChange({...value,technician_name:e.target.value})} /></label>
  <label>Diagnóstico<textarea value={value.diagnosis ?? ''} onChange={e=>onChange({...value,diagnosis:e.target.value})} placeholder="Falla encontrada y diagnóstico inicial" /></label>
  <label>Presupuesto (S/)<input type="number" min="0" step="0.01" value={value.estimate_amount ?? ''} onChange={e=>onChange({...value,estimate_amount:e.target.value?Number(e.target.value):undefined})} /></label>
  <label>Notas<textarea value={value.notes ?? ''} onChange={e=>onChange({...value,notes:e.target.value})} /></label>
</>

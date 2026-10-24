import type { CustomerDraft } from '../types/customer.types'
export const CustomerForm = ({ value, onChange }: { value: CustomerDraft; onChange: (value: CustomerDraft) => void }) => <>
  <label>Tipo de cliente<select value={value.customer_type} onChange={e => onChange({...value, customer_type:e.target.value as CustomerDraft['customer_type']})}><option value="PERSONA">Persona</option><option value="EMPRESA">Empresa</option></select></label>
  <label>Nombre / razón social<input autoFocus value={value.full_name} onChange={e=>onChange({...value,full_name:e.target.value})} placeholder="Nombre completo o razón social" /></label>
  <label>Tipo de documento<select value={value.document_type} onChange={e=>onChange({...value,document_type:e.target.value as CustomerDraft['document_type']})}><option>DNI</option><option>CE</option><option>RUC</option></select></label>
  <label>N.º de documento<input value={value.document_number} onChange={e=>onChange({...value,document_number:e.target.value})} /></label>
  <label>Teléfono<input value={value.phone} onChange={e=>onChange({...value,phone:e.target.value})} /></label>
  <label>Correo electrónico<input type="email" value={value.email} onChange={e=>onChange({...value,email:e.target.value})} /></label>
  <label>Dirección<input value={value.address} onChange={e=>onChange({...value,address:e.target.value})} /></label>
  <label>Observaciones<textarea value={value.notes} onChange={e=>onChange({...value,notes:e.target.value})} /></label>
</>

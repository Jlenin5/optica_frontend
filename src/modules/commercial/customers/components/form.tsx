import { Building2, FileText, Mail, MapPin, Phone, StickyNote, UserRound } from 'lucide-react';
import type { CustomerDraft } from '../types/customer.types';

interface Props { value: CustomerDraft; onChange: (value: CustomerDraft) => void; }
const update = (value: CustomerDraft, onChange: Props['onChange'], patch: Partial<CustomerDraft>) => onChange({ ...value, ...patch });

export const CustomerForm = ({ value, onChange }: Props) => {
  const isCompany = value.customer_type === 'EMPRESA';
  return <div className="customer-form">
    <div className="customer-form__section">
      <div><h3>Datos principales</h3><p>Identifica correctamente al cliente para ventas, citas y comprobantes.</p></div>
      <div className="customer-form__grid">
        <label><span>Tipo de cliente</span><select value={value.customer_type} onChange={e => update(value,onChange,{customer_type:e.target.value as CustomerDraft['customer_type'], document_type:e.target.value === 'EMPRESA' ? 'RUC' : value.document_type === 'RUC' ? 'DNI' : value.document_type})}><option value="PERSONA">Persona</option><option value="EMPRESA">Empresa</option></select></label>
        <label><span>Estado</span><select value={value.status} onChange={e => update(value,onChange,{status:e.target.value as CustomerDraft['status']})}><option value="ACTIVO">Activo</option><option value="INACTIVO">Inactivo</option></select></label>
        <label className="customer-form__wide"><span><UserRound size={14}/>{isCompany ? 'Razón social' : 'Nombre completo'} <b>*</b></span><input autoFocus value={value.full_name} onChange={e=>update(value,onChange,{full_name:e.target.value})} placeholder={isCompany ? 'Ej. Óptica Visión S.A.C.' : 'Ej. María García López'} /></label>
        <label><span><FileText size={14}/>Tipo de documento</span><select value={value.document_type} onChange={e=>update(value,onChange,{document_type:e.target.value as CustomerDraft['document_type']})}><option>DNI</option><option>CE</option><option>RUC</option><option>PASAPORTE</option></select></label>
        <label><span>Número de documento <b>*</b></span><input value={value.document_number} onChange={e=>update(value,onChange,{document_number:e.target.value})} placeholder="Ingrese el número" /></label>
      </div>
    </div>
    <div className="customer-form__section">
      <div><h3>Contacto y ubicación</h3><p>Información para comunicación y entrega.</p></div>
      <div className="customer-form__grid">
        <label><span><Phone size={14}/>Teléfono</span><input value={value.phone} onChange={e=>update(value,onChange,{phone:e.target.value})} placeholder="999 999 999" /></label>
        <label><span><Mail size={14}/>Correo electrónico</span><input type="email" value={value.email} onChange={e=>update(value,onChange,{email:e.target.value})} placeholder="cliente@correo.com" /></label>
        <label className="customer-form__wide"><span><MapPin size={14}/>Dirección</span><input value={value.address} onChange={e=>update(value,onChange,{address:e.target.value})} placeholder="Dirección, distrito y referencia" /></label>
        <label className="customer-form__wide"><span><StickyNote size={14}/>Observaciones</span><textarea rows={3} value={value.notes} onChange={e=>update(value,onChange,{notes:e.target.value})} placeholder="Notas internas opcionales..." /></label>
      </div>
    </div>
  </div>;
};

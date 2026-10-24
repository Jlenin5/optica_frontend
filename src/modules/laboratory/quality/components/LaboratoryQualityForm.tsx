import type {LaboratoryQualityDTO} from '../types/laboratory-quality.types'
export const LaboratoryQualityForm=({value,onChange}:{value:LaboratoryQualityDTO;onChange:(v:LaboratoryQualityDTO)=>void})=><>
  <label>Orden de laboratorio<input autoFocus value={value.laboratory_order_code} onChange={e=>onChange({...value,laboratory_order_code:e.target.value})} placeholder="LAB-0000" /></label>
  <label>Lente / trabajo<input value={value.lens_description??''} onChange={e=>onChange({...value,lens_description:e.target.value})} /></label>
  <label>Técnico de control<input value={value.technician_name??''} onChange={e=>onChange({...value,technician_name:e.target.value})} /></label>
  <label>Resultado<textarea value={value.result??''} onChange={e=>onChange({...value,result:e.target.value})} placeholder="Aprobado, observado, defecto encontrado..." /></label>
  <label>Observaciones / reproceso<textarea value={value.notes??''} onChange={e=>onChange({...value,notes:e.target.value})} /></label>
  <label>Estado<select value={value.status??'Pendiente'} onChange={e=>onChange({...value,status:e.target.value as LaboratoryQualityDTO['status']})}><option>Pendiente</option><option>En proceso</option><option>Observado</option><option>Listo</option><option>Completado</option><option>Cancelado</option></select></label>
</>

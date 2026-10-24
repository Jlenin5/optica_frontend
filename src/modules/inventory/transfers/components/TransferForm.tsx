import type {InventoryTransferDTO} from '../types/transfers.types'
export const TransferForm=({value,onChange}:{value:InventoryTransferDTO;onChange:(v:InventoryTransferDTO)=>void})=><>
  <label>Almacén / tienda origen<input autoFocus value={value.source_name} onChange={e=>onChange({...value,source_name:e.target.value})} placeholder="Origen" /></label>
  <label>Almacén / tienda destino<input value={value.destination_name} onChange={e=>onChange({...value,destination_name:e.target.value})} placeholder="Destino" /></label>
  <label>Cantidad de ítems<input type="number" min="1" value={value.items_count??''} onChange={e=>onChange({...value,items_count:e.target.value?Number(e.target.value):undefined})} /></label>
  <label>Responsable<input value={value.responsible_name??''} onChange={e=>onChange({...value,responsible_name:e.target.value})} /></label>
  <label>Detalle<textarea value={value.detail??''} onChange={e=>onChange({...value,detail:e.target.value})} placeholder="Productos y motivo de transferencia" /></label>
  <label>Estado<select value={value.status??'Pendiente'} onChange={e=>onChange({...value,status:e.target.value as InventoryTransferDTO['status']})}><option>Pendiente</option><option>En proceso</option><option>Completado</option><option>Cancelado</option></select></label>
</>

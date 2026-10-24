import { useAudit } from '../hooks/useReports'
import { AuditTable } from '../components/AuditTable'
import type { AuditEntry } from '../types/reports.types'
import '@/styles/components/_operational.scss'
const demo:AuditEntry[]=[{id:9012,code:'AUD-9012',entity:'Venta V-3822',action:'Cambio de estado',user_name:'Ana / Ventas',detail:'Pendiente → Pagada',created_at:'11/09/2026'},{id:9011,code:'AUD-9011',entity:'Prescripción P-883',action:'Creación',user_name:'Dr. Luis',detail:'Consulta C-1204',created_at:'11/09/2026'},{id:9010,code:'AUD-9010',entity:'Orden LAB-550',action:'Incidencia',user_name:'Técnico 01',detail:'Medida fuera de tolerancia',created_at:'10/09/2026'}]
export const AuditPage=()=>{const query=useAudit({limit:100});const items=query.data?.results?.length?query.data.results:demo;return <section className="operational-page"><header className="operational-page__header"><div><div className="operational-page__eyebrow">Reportes y control</div><h1>Auditoría y trazabilidad</h1><p>Reconstruye quién realizó cada operación, cuándo, sobre qué registro y qué información cambió.</p></div></header><AuditTable items={items}/></section>}

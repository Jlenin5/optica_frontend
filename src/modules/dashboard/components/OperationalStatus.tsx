import MuiSvgIcon from '@components/MuiSvgIcon'

interface OperationalStatusProps {
  pendingOrders: number
  pendingInvoices: number
  todayAppointments: number
  activeSubscriptions: number
}

export const OperationalStatus = ({ pendingOrders, pendingInvoices, todayAppointments, activeSubscriptions }: OperationalStatusProps) => {
  const totalPending = pendingOrders + pendingInvoices

  return (
    <section className="dashboard-panel dashboard-panel--operations">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">Operación</span>
          <h3><MuiSvgIcon size={18}>lucide:activity</MuiSvgIcon> Estado de hoy</h3>
        </div>
        <span className={`status-pill ${totalPending === 0 ? 'status-pill--success' : 'status-pill--warning'}`}>
          {totalPending === 0 ? 'Al día' : `${totalPending} por revisar`}
        </span>
      </div>

      <div className="operation-list">
        <div><span className="operation-list__icon operation-list__icon--orange"><MuiSvgIcon size={16}>lucide:clock-3</MuiSvgIcon></span><span>Ventas pendientes</span><strong>{pendingOrders}</strong></div>
        <div><span className="operation-list__icon operation-list__icon--red"><MuiSvgIcon size={16}>lucide:file-warning</MuiSvgIcon></span><span>Facturas pendientes</span><strong>{pendingInvoices}</strong></div>
        <div><span className="operation-list__icon operation-list__icon--purple"><MuiSvgIcon size={16}>lucide:calendar-check</MuiSvgIcon></span><span>Citas para hoy</span><strong>{todayAppointments}</strong></div>
        <div><span className="operation-list__icon operation-list__icon--blue"><MuiSvgIcon size={16}>lucide:badge-check</MuiSvgIcon></span><span>Suscripciones activas</span><strong>{activeSubscriptions}</strong></div>
      </div>
    </section>
  )
}

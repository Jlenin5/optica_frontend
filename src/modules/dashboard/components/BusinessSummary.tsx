import MuiSvgIcon from '@components/MuiSvgIcon'

interface BusinessSummaryProps {
  monthlyPatients: number
  weeklyAppointments: number
  totalRevenue: number
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 2,
  }).format(value)

export const BusinessSummary = ({ monthlyPatients, weeklyAppointments, totalRevenue }: BusinessSummaryProps) => {
  const averageTicket = weeklyAppointments > 0 ? totalRevenue / weeklyAppointments : 0

  return (
    <section className="dashboard-panel dashboard-panel--summary">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">Resumen</span>
          <h3><MuiSvgIcon size={18}>lucide:bar-chart-3</MuiSvgIcon> Rendimiento del negocio</h3>
        </div>
      </div>

      <div className="summary-metrics">
        <div className="summary-metrics__item">
          <span className="summary-metrics__icon summary-metrics__icon--blue"><MuiSvgIcon size={17}>lucide:users</MuiSvgIcon></span>
          <div><strong>{monthlyPatients}</strong><span>Pacientes este mes</span></div>
        </div>
        <div className="summary-metrics__item">
          <span className="summary-metrics__icon summary-metrics__icon--purple"><MuiSvgIcon size={17}>lucide:calendar-days</MuiSvgIcon></span>
          <div><strong>{weeklyAppointments}</strong><span>Citas esta semana</span></div>
        </div>
        <div className="summary-metrics__item">
          <span className="summary-metrics__icon summary-metrics__icon--green"><MuiSvgIcon size={17}>lucide:wallet</MuiSvgIcon></span>
          <div><strong>{formatMoney(totalRevenue)}</strong><span>Ingresos acumulados</span></div>
        </div>
      </div>

      <div className="dashboard-panel__footer">
        <MuiSvgIcon size={15}>lucide:receipt</MuiSvgIcon>
        Ticket promedio referencial: <strong>{formatMoney(averageTicket)}</strong>
      </div>
    </section>
  )
}

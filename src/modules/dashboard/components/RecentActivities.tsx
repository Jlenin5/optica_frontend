import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { RecentActivity } from "../types/dashboard.types"

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    appointment: 'lucide:calendar-check',
    patient: 'lucide:user-plus',
    customer: 'lucide:user-plus',
    sale: 'lucide:shopping-cart',
    order: 'lucide:package'
  }
  return icons[type] || 'lucide:bell'
}

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    appointment: '#8b5cf6',
    customer: '#10b981',
    sale: '#3b82f6',
    order: '#f59e0b'
  }
  return colors[type] || '#6b7280'
}

const getStatusBadge = (status?: string) => {
  if (!status) return null
  const normalized = status.toLowerCase()
  const statusConfig: Record<string, { label: string; color: string }> = {
    completed: { label: 'Completado', color: '#10b981' },
    complete: { label: 'Completado', color: '#10b981' },
    pendiente: { label: 'Pendiente', color: '#f59e0b' },
    pending: { label: 'Pendiente', color: '#f59e0b' },
    cancelado: { label: 'Cancelado', color: '#ef4444' },
    cancelled: { label: 'Cancelado', color: '#ef4444' },
  }
  const config = statusConfig[normalized]
  return config ? <span className="recent-activities__status" style={{ backgroundColor: `${config.color}15`, color: config.color }}>{config.label}</span> : null
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <div className="recent-activities">
      <div className="recent-activities__header">
        <h3 className="recent-activities__title">
          <MuiSvgIcon size={20}>lucide:clock</MuiSvgIcon>
          Actividad Reciente
        </h3>
      </div>

      <div className="recent-activities__list">
        {activities?.length === 0 ? (
          <div className="recent-activities__empty">
            <MuiSvgIcon size={32}>lucide:inbox</MuiSvgIcon>
            <p>No hay actividad reciente</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity?.id} className="recent-activities__item">
              <div className="recent-activities__icon" style={{ backgroundColor: `${getActivityColor(activity?.type)}15` }}>
                <MuiSvgIcon size={18} style={{ color: getActivityColor(activity?.type) }}>
                  {getActivityIcon(activity?.type)}
                </MuiSvgIcon>
              </div>
              <div className="recent-activities__content">
                <div className="recent-activities__item-header">
                  <span className="recent-activities__title-text">{activity?.title}</span>
                  {getStatusBadge(activity?.status)}
                </div>
                <p className="recent-activities__description">{activity?.description}</p>
                <span className="recent-activities__time">
                  {/* {formatDistanceToNow(new Date(activity?.time), { addSuffix: true, locale: es })} */}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
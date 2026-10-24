import type { UserStats } from "../types/users.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
// import { useAuthStore } from "@/app/store/auth.store"

interface UserStatsCardsProps {
  stats: UserStats
}

export const UserStatsCards = ({ stats }: UserStatsCardsProps) => {
  // const { isSuperAdmin, user, currentCompanyId } = useAuthStore()
  
  // Determinar si mostrar el contexto de las estadísticas
  // const showContext = !isSuperAdmin && currentCompanyId
  
  const cards = [
    {
      title: 'Total Usuarios',
      value: stats.total,
      icon: 'lucide:users',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Usuarios Activos',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Usuarios Inactivos',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Administradores',
      value: stats.admins,
      icon: 'lucide:shield',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Staff',
      value: stats.staff,
      icon: 'lucide:briefcase',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="user-stats">      
      <div className="user-stats">
        {cards.map((card, index) => (
          <div key={index} className="user-stats__card">
            <div className="user-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="user-stats__card-info">
              <p className="user-stats__card-title">{card.title}</p>
              <p className="user-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}

        {/* Mostrar distribución por rol si existe */}
        {stats.by_role && stats.by_role.length > 0 && (
          <div className="user-stats__group">
            <h4 className="user-stats__group-title">Por Rol</h4>
            <div className="user-stats__group-list">
              {stats.by_role.map((item, index) => (
                <div key={index} className="user-stats__group-item">
                  <span className="user-stats__group-label">{item.role_name}</span>
                  <span className="user-stats__group-value">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
import type { BrandStats } from "../types/brands.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface BrandStatsCardsProps {
  stats: BrandStats
}

export const BrandStatsCards = ({ stats }: BrandStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Marcas',
      value: stats.total,
      icon: 'lucide:gallery-horizontal-end',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Marcas Activas',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Marcas Inactivas',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Visibles en Web',
      value: stats.visible_on_web,
      icon: 'lucide:globe',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Ocultas en Web',
      value: stats.hidden_on_web,
      icon: 'lucide:eye-off',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)'
    },
    {
      title: 'Con Sitio Web',
      value: stats.with_website,
      icon: 'lucide:link',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="brand-stats">
      {showContext && (
        <div className="brand-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="brand-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="brand-stats__card">
            <div className="brand-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="brand-stats__card-info">
              <p className="brand-stats__card-title">{card.title}</p>
              <p className="brand-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
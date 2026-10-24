import type { CategoryStats } from "../types/categories.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface CategoryStatsCardsProps {
  stats: CategoryStats
}

export const CategoryStatsCards = ({ stats }: CategoryStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Categorías',
      value: stats.total,
      icon: 'lucide:folder',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Categorías Activas',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Categorías Inactivas',
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
      title: 'Subcategorías',
      value: stats.with_parent,
      icon: 'lucide:folder-tree',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="category-stats">
      {showContext && (
        <div className="category-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="category-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="category-stats__card">
            <div className="category-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="category-stats__card-info">
              <p className="category-stats__card-title">{card.title}</p>
              <p className="category-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
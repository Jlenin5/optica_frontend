import type { ProductStats } from "../types/products.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface ProductStatsCardsProps {
  stats: ProductStats
}

export const ProductStatsCards = ({ stats }: ProductStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Productos',
      value: stats.total,
      icon: 'lucide:package',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Productos Activos',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Productos Inactivos',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Stock Bajo',
      value: stats.low_stock,
      icon: 'lucide:triangle-alert',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Sin Stock',
      value: stats.out_of_stock,
      icon: 'lucide:package-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Valor del Inventario',
      value: `S/ ${stats.total_value.toLocaleString()}`,
      icon: 'lucide:credit-card',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    }
  ]

  return (
    <div className="product-stats">
      {showContext && (
        <div className="product-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="product-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="product-stats__card">
            <div className="product-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="product-stats__card-info">
              <p className="product-stats__card-title">{card.title}</p>
              <p className="product-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_type && stats.by_type.length > 0 && (
        <div className="product-stats__group">
          <h4 className="product-stats__group-title">Distribución por Tipo</h4>
          <div className="product-stats__group-list">
            {stats.by_type.map((item, index) => (
              <div key={index} className="product-stats__group-item">
                <span className="product-stats__group-label">{item.label}</span>
                <span className="product-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
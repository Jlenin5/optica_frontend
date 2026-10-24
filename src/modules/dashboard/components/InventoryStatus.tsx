import type { CSSProperties } from 'react'
import MuiSvgIcon from '@components/MuiSvgIcon'

interface InventoryStatusProps {
  lowStockProducts: number
  totalPatients: number
  monthlySales: number
}

const money = (value: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(value)

export const InventoryStatus = ({ lowStockProducts, totalPatients, monthlySales }: InventoryStatusProps) => {
  const health = lowStockProducts === 0 ? 100 : Math.max(35, 100 - lowStockProducts * 12)

  return (
    <section className="dashboard-panel dashboard-panel--inventory">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">Control</span>
          <h3><MuiSvgIcon size={18}>lucide:package-check</MuiSvgIcon> Stock y crecimiento</h3>
        </div>
      </div>

      <div className="inventory-score">
        <div className="inventory-score__ring" style={{ '--score': `${health}%` } as CSSProperties}>
          <strong>{health}%</strong><span>estado</span>
        </div>
        <div className="inventory-score__text">
          <strong>{lowStockProducts === 0 ? 'Stock controlado' : 'Requiere atención'}</strong>
          <span>{lowStockProducts} productos con stock bajo</span>
        </div>
      </div>

      <div className="inventory-mini-stats">
        <div><span>Pacientes</span><strong>{totalPatients}</strong></div>
        <div><span>Ventas del mes</span><strong>{money(monthlySales)}</strong></div>
      </div>
    </section>
  )
}

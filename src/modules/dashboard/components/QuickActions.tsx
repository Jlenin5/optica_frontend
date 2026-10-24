import { Link } from "react-router-dom"
import MuiSvgIcon from '@components/MuiSvgIcon'

const actions = [
  { to: "/patients", label: "Nuevo Paciente", icon: "lucide:user-plus", color: "#3b82f6" },
  { to: "/appointments/new", label: "Nueva Cita", icon: "lucide:calendar-plus", color: "#8b5cf6" },
  { to: "/sales/create", label: "Nueva Venta", icon: "lucide:shopping-cart", color: "#10b981" },
  { to: "/inventory/products", label: "Nuevo Producto", icon: "lucide:package-plus", color: "#f59e0b" }
]

export const QuickActions = () => {
  return (
    <div className="quick-actions">
      <div className="quick-actions__header">
        <h3 className="quick-actions__title">
          <MuiSvgIcon size={20}>lucide:zap</MuiSvgIcon>
          Acciones Rápidas
        </h3>
      </div>

      <div className="quick-actions__grid">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className="quick-actions__card">
            <div className="quick-actions__icon" style={{ backgroundColor: `${action.color}15` }}>
              <MuiSvgIcon size={24} style={{ color: action.color }}>{action.icon}</MuiSvgIcon>
            </div>
            <span className="quick-actions__label">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
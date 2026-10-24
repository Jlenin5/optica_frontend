import type { PatientStats } from "../types/patients.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface PatientStatsCardsProps {
  stats: PatientStats
}

export const PatientStatsCards = ({ stats }: PatientStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Pacientes',
      value: stats.total,
      icon: 'lucide:users',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Pacientes Activos',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Pacientes Inactivos',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ]

  const ageGroups = [
    {
      label: 'Niños (0-12 años)',
      key: 'children',
      icon: 'lucide:user',
      color: '#10b981'
    },
    {
      label: 'Adolescentes (13-17 años)',
      key: 'adolescents',
      icon: 'lucide:user',
      color: '#8b5cf6'
    },
    {
      label: 'Adultos (18-59 años)',
      key: 'adults',
      icon: 'lucide:user-round',
      color: '#3b82f6'
    },
    {
      label: 'Adultos Mayores (60+ años)',
      key: 'seniors',
      icon: 'lucide:user-round',
      color: '#f59e0b'
    },
    {
      label: 'Sin fecha',
      key: 'unknown',
      icon: 'lucide:calendar-x',
      color: '#6b7280'
    }
  ]

  // Calcular total de pacientes para porcentajes
  const totalPatients = stats.total || 1

  return (
    <div className="patient-stats">
      {/* Contexto de estadísticas */}
      {showContext && (
        <div className="patient-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      {/* Cards principales */}
      <div className="patient-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="patient-stats__card">
            <div className="patient-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="patient-stats__card-info">
              <p className="patient-stats__card-title">{card.title}</p>
              <p className="patient-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Distribuciones - Grid de 3 columnas */}
      <div className="patient-stats__distributions">
        {/* Distribución por Edad */}
        <div className="patient-stats__distribution-card">
          <div className="patient-stats__distribution-header">
            <MuiSvgIcon size={20} style={{ color: '#8b5cf6' }}>lucide:chart-pie</MuiSvgIcon>
            <h4 className="patient-stats__distribution-title">Distribución por Edad</h4>
          </div>
          <div className="patient-stats__distribution-content">
            {ageGroups.map((group) => {
              const count = stats.age_groups?.[group.key as keyof typeof stats.age_groups] || 0
              const percentage = (count / totalPatients) * 100
              return (
                <div key={group.key} className="patient-stats__distribution-item">
                  <div className="patient-stats__distribution-item-left">
                    <div className="patient-stats__distribution-icon" style={{ backgroundColor: `${group.color}15`, color: group.color }}>
                      <MuiSvgIcon size={14}>{group.icon}</MuiSvgIcon>
                    </div>
                    <span className="patient-stats__distribution-label">{group.label}</span>
                  </div>
                  <div className="patient-stats__distribution-stats">
                    <span className="patient-stats__distribution-count">{count}</span>
                    <span className="patient-stats__distribution-percentage">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Por Tipo de Documento */}
        {stats.by_document_type && stats.by_document_type.length > 0 && (
          <div className="patient-stats__distribution-card">
            <div className="patient-stats__distribution-header">
              <MuiSvgIcon size={20} style={{ color: '#3b82f6' }}>lucide:file-text</MuiSvgIcon>
              <h4 className="patient-stats__distribution-title">Por Tipo de Documento</h4>
            </div>
            <div className="patient-stats__distribution-content">
              {stats.by_document_type.map((item, index) => {
                const percentage = (item.count / totalPatients) * 100
                return (
                  <div key={index} className="patient-stats__distribution-item">
                    <span className="patient-stats__distribution-label">{item.document_type_description}</span>
                    <div className="patient-stats__distribution-stats">
                      <span className="patient-stats__distribution-count">{item.count}</span>
                      <span className="patient-stats__distribution-percentage">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Por Empresa - solo para super admin */}
        {stats.by_company && stats.by_company.length > 0 && isSuperAdmin && (
          <div className="patient-stats__distribution-card">
            <div className="patient-stats__distribution-header">
              <MuiSvgIcon size={20} style={{ color: '#f59e0b' }}>lucide:building-2</MuiSvgIcon>
              <h4 className="patient-stats__distribution-title">Por Empresa</h4>
            </div>
            <div className="patient-stats__distribution-content">
              {stats.by_company.map((item, index) => {
                const percentage = (item.count / totalPatients) * 100
                return (
                  <div key={index} className="patient-stats__distribution-item">
                    <span className="patient-stats__distribution-label">{item.company_name}</span>
                    <div className="patient-stats__distribution-stats">
                      <span className="patient-stats__distribution-count">{item.count}</span>
                      <span className="patient-stats__distribution-percentage">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
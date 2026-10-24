import MuiSvgIcon from '@components/MuiSvgIcon'

interface PlanFeaturesTableProps {
  features: Array<{
    id: number
    feature_id: number
    feature?: {
      id: number
      code: string
      name: string
      description?: string
    }
  }>
  onRemove: (id: number) => void
  onViewUsage?: (featureId: number, featureName: string) => void
  isRemoving: boolean
}

const getFeatureIcon = (code: string) => {
  const icons: Record<string, string> = {
    sales_module: 'lucide:shopping-cart',
    inventory_module: 'lucide:package',
    clinical_module: 'lucide:heart',
    laboratory_module: 'lucide:flask',
    reports_module: 'lucide:bar-chart',
    multi_store: 'lucide:building-2',
    electronic_invoicing: 'lucide:file-text',
    cash_module: 'lucide:credit-card'
  }
  return icons[code] || 'lucide:settings'
}

export const PlanFeaturesTable = ({
  features,
  onRemove,
  onViewUsage,
  isRemoving
}: PlanFeaturesTableProps) => {
  return (
    <div className="plan-features-table-container">
      <table className="plan-features-table">
        <thead>
          <tr>
            <th>Característica</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {features.map((item) => (
            <tr key={item.id}>
              <td className="plan-features-table__feature">
                <div className="plan-features-table__feature-info">
                  <div className="plan-features-table__feature-icon">
                    <MuiSvgIcon size={20}>
                      {getFeatureIcon(item.feature?.code || '')}
                    </MuiSvgIcon>
                  </div>
                  <div>
                    <div className="plan-features-table__feature-name">
                      {item.feature?.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="plan-features-table__code">
                <code>{item.feature?.code}</code>
              </td>
              <td className="plan-features-table__description">
                {item.feature?.description || 'Sin descripción'}
              </td>
              <td className="plan-features-table__actions">
                {onViewUsage && (
                  <button
                    className="plan-features-table__action-btn plan-features-table__action-btn--view"
                    onClick={() => onViewUsage(item.feature_id, item.feature?.name || '')}
                    title="Ver uso en otros planes"
                  >
                    <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
                  </button>
                )}
                <button
                  className="plan-features-table__action-btn plan-features-table__action-btn--delete"
                  onClick={() => onRemove(item.id)}
                  disabled={isRemoving}
                  title="Remover característica"
                >
                  <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
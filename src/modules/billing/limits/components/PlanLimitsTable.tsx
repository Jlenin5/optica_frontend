import { useState } from "react"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PlanLimitTableItem {
  id: number
  limit_id: number
  limit?: {
    code: string
    name: string
  }
  value: number | null
}

interface PlanLimitsTableProps {
  limits: PlanLimitTableItem[]
  onUpdateValue: (id: number, value: number | null) => void
  onRemove: (id: number) => void
  onViewUsage?: (limitId: number, limitName: string) => void
  editingValue: { id: number; value: number | null } | null
  setEditingValue: (value: { id: number; value: number | null } | null) => void
  isUpdating: boolean
  isRemoving: boolean
}

export const PlanLimitsTable = ({
  limits,
  onUpdateValue,
  onRemove,
  onViewUsage,
  editingValue,
  setEditingValue,
  isUpdating,
  isRemoving
}: PlanLimitsTableProps) => {
  const [tempValue, setTempValue] = useState<string>("")

  const handleStartEdit = (limit: PlanLimitTableItem) => {
    setEditingValue({ id: limit.id, value: limit.value })
    setTempValue(limit.value?.toString() || "")
  }

  const handleSaveEdit = () => {
    if (editingValue) {
      const value = tempValue === "" ? null : parseInt(tempValue)
      if (!isNaN(value as number) || value === null) {
        onUpdateValue(editingValue.id, value)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingValue(null)
    setTempValue("")
  }

  const getLimitIcon = (code: string) => {
    const icons: Record<string, string> = {
      max_users: 'lucide:users',
      max_products: 'lucide:package',
      max_customers: 'lucide:user',
      max_documents: 'lucide:file-text',
      max_stores: 'lucide:building',
      max_warehouses: 'lucide:warehouse'
    }
    return icons[code] || 'lucide:settings'
  }

  return (
    <div className="plan-limits-table-container">
      <table className="plan-limits-table">
        <thead>
          <tr>
            <th>Límite</th>
            <th>Código</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {limits.map((limit) => (
            <tr key={limit.id}>
              <td className="plan-limits-table__limit">
                <div className="plan-limits-table__limit-info">
                  <div className="plan-limits-table__limit-icon">
                    <MuiSvgIcon size={20}>
                      {getLimitIcon(limit.limit?.code || '')}
                    </MuiSvgIcon>
                  </div>
                  <div>
                    <div className="plan-limits-table__limit-name">
                      {limit.limit?.name}
                    </div>
                    <div className="plan-limits-table__limit-code">
                      {limit.limit?.code}
                    </div>
                  </div>
                </div>
              </td>
              <td className="plan-limits-table__code">
                <code>{limit.limit?.code}</code>
              </td>
              <td className="plan-limits-table__value">
                {editingValue?.id === limit.id ? (
                  <div className="plan-limits-table__value-edit">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder="Sin límite"
                      className="plan-limits-table__value-input"
                      autoFocus
                    />
                    <button
                      className="plan-limits-table__value-save"
                      onClick={handleSaveEdit}
                      disabled={isUpdating}
                    >
                      <MuiSvgIcon size={16}>lucide:check</MuiSvgIcon>
                    </button>
                    <button
                      className="plan-limits-table__value-cancel"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
                    </button>
                  </div>
                ) : (
                  <div className="plan-limits-table__value-display">
                    <span className={`plan-limits-table__value-text ${!limit.value ? 'plan-limits-table__value-text--empty' : ''}`}>
                      {limit.value !== null ? limit.value.toLocaleString() : 'Sin límite'}
                    </span>
                    {limit.value !== null && (
                      <span className="plan-limits-table__value-unit">unidades</span>
                    )}
                  </div>
                )}
              </td>
              <td className="plan-limits-table__actions">
                {onViewUsage && (
                  <button
                    className="plan-limits-table__action-btn plan-limits-table__action-btn--view"
                    onClick={() => onViewUsage(limit.limit_id, limit.limit?.name || '')}
                    title="Ver uso en otros planes"
                  >
                    <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
                  </button>
                )}
                {editingValue?.id !== limit.id && (
                  <button
                    className="plan-limits-table__action-btn plan-limits-table__action-btn--edit"
                    onClick={() => handleStartEdit(limit)}
                    title="Editar valor"
                  >
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                )}
                <button
                  className="plan-limits-table__action-btn plan-limits-table__action-btn--delete"
                  onClick={() => onRemove(limit.id)}
                  disabled={isRemoving}
                  title="Remover límite"
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
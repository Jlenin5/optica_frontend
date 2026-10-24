import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteFeature } from "../hooks/useDeleteFeature"
import type { Feature } from "../types/features.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface FeatureTableProps {
  data: Feature[]
  onEdit: (feature: Feature) => void
  onRefresh: () => void
}

export const FeatureTable = ({ data, onEdit, onRefresh }: FeatureTableProps) => {
  const navigate = useNavigate()
  const { mutate: deleteFeature, isPending: isDeleting } = useDeleteFeature()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta característica?")) {
      setDeletingId(id)
      deleteFeature(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleViewUsage = (feature: Feature) => {
    navigate(`/billing/plan-features?feature_id=${feature.id}&feature_name=${encodeURIComponent(feature.name)}`)
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

  return (
    <div className="feature-table-container">
      <table className="feature-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((feature) => (
            <tr key={feature.id}>
              <td className="feature-table__id">{feature.id}</td>
              <td className="feature-table__code">
                <div className="feature-table__code-wrapper">
                  <div className="feature-table__code-icon">
                    <MuiSvgIcon size={16}>{getFeatureIcon(feature.code)}</MuiSvgIcon>
                  </div>
                  <code>{feature.code}</code>
                </div>
              </td>
              <td className="feature-table__name">
                <div className="feature-table__name-info">
                  <span className="feature-table__name-text">{feature.name}</span>
                </div>
              </td>
              <td className="feature-table__description">
                <div className="feature-table__description-text">
                  {feature.description || 'Sin descripción'}
                </div>
              </td>
              <td className="feature-table__actions">
                <button 
                  className="feature-table__action-btn feature-table__action-btn--view"
                  onClick={() => handleViewUsage(feature)}
                  title="Ver planes que usan esta característica"
                >
                  <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
                </button>
                <button 
                  className="feature-table__action-btn feature-table__action-btn--edit"
                  onClick={() => onEdit(feature)}
                  title="Editar"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button 
                  className="feature-table__action-btn feature-table__action-btn--delete"
                  onClick={() => handleDelete(feature.id)}
                  disabled={isDeleting && deletingId === feature.id}
                  title="Eliminar"
                >
                  {isDeleting && deletingId === feature.id ? (
                    <span className="feature-table__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
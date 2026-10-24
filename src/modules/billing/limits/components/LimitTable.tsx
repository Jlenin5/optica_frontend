// modules/limits/components/LimitTable.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteLimit } from "../hooks/useDeleteLimit"
import type { Limit } from "../types/limits.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface LimitTableProps {
  data: Limit[]
  onEdit: (limit: Limit) => void
  onRefresh: () => void
}

export const LimitTable = ({ data, onEdit, onRefresh }: LimitTableProps) => {
  const navigate = useNavigate()
  const { mutate: deleteLimit, isPending: isDeleting } = useDeleteLimit()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este límite?")) {
      setDeletingId(id)
      deleteLimit(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleViewUsage = (limit: Limit) => {
    // Navegar a PlanLimitsPage con el limit_id como query param
    // Esto mostrará un modal con todos los planes que usan este límite
    navigate(`/billing/plan-limits?limit_id=${limit.id}&limit_name=${encodeURIComponent(limit.name)}`)
  }

  const getCodeLabel = (code: string) => {
    const labels: Record<string, string> = {
      max_users: "Máximo de Usuarios",
      max_products: "Máximo de Productos",
      max_customers: "Máximo de Clientes",
      max_documents: "Máximo de Documentos",
      max_stores: "Máximo de Sucursales",
      max_warehouses: "Máximo de Almacenes"
    }
    return labels[code] || code.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="limit-table-container">
      <table className="limit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Planes que lo usan</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((limit) => (
            <tr key={limit.id}>
              <td className="limit-table__id">{limit.id}</td>
              <td className="limit-table__code">
                <code>{limit.code}</code>
              </td>
              <td className="limit-table__name">
                <div className="limit-table__name-info">
                  <span className="limit-table__name-text">{limit.name}</span>
                  <span className="limit-table__name-hint">
                    {getCodeLabel(limit.code)}
                  </span>
                </div>
              </td>
              <td className="limit-table__usage">
                <button 
                  className="limit-table__usage-btn"
                  onClick={() => handleViewUsage(limit)}
                  title="Ver planes que usan este límite"
                >
                  <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
                  Ver uso
                </button>
              </td>
              <td className="limit-table__actions">
                <button 
                  className="limit-table__action-btn limit-table__action-btn--edit"
                  onClick={() => onEdit(limit)}
                  title="Editar"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button 
                  className="limit-table__action-btn limit-table__action-btn--delete"
                  onClick={() => handleDelete(limit.id)}
                  disabled={isDeleting && deletingId === limit.id}
                  title="Eliminar"
                >
                  {isDeleting && deletingId === limit.id ? (
                    <span className="limit-table__spinner"></span>
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
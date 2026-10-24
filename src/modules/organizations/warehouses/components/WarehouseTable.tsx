import { useState } from "react"
import { useDeleteWarehouse } from "../hooks/useDeleteWarehouse"
import { useToggleWarehouseStatus } from "../hooks/useToggleWarehouseStatus"
import type { Warehouse } from "../types/warehouses.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface WarehouseTableProps {
  data: Warehouse[]
  onEdit: (warehouse: Warehouse) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const WarehouseTable = ({ data, onEdit, onRefresh }: WarehouseTableProps) => {
  const { mutate: deleteWarehouse, isPending: isDeleting } = useDeleteWarehouse()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleWarehouseStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este almacén?")) {
      setDeletingId(id)
      deleteWarehouse(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    setTogglingId(id)
    toggleStatus({ id, status: !currentStatus }, {
      onSuccess: () => {
        onRefresh()
      },
      onSettled: () => {
        setTogglingId(null)
      }
    })
  }

  const getTypeLabel = (warehouse: Warehouse) => {
    if (warehouse.company_or_branch_office) {
      return {
        label: 'Empresa',
        icon: 'lucide:building-2',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.1)'
      }
    } else {
      return {
        label: 'Sucursal',
        icon: 'lucide:map-pin',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.1)'
      }
    }
  }

  const getOwnerName = (warehouse: Warehouse) => {
    if (warehouse.company_or_branch_office) {
      return warehouse.company?.name || 'Empresa no asignada'
    } else {
      return warehouse.branch_office?.name || 'Sucursal no asignada'
    }
  }

  return (
    <div className="warehouse-table-container">
      <table className="warehouse-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Pertenece a</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((warehouse) => {
            const typeConfig = getTypeLabel(warehouse)
            return (
              <tr key={warehouse.id}>
                <td className="warehouse-table__name">
                  <div className="warehouse-table__name-info">
                    <span className="warehouse-table__name-text">{warehouse.name}</span>
                  </div>
                </td>
                <td className="warehouse-table__type">
                  <span 
                    className="warehouse-table__type-badge"
                    style={{ backgroundColor: typeConfig.bgColor, color: typeConfig.color }}
                  >
                    <MuiSvgIcon size={14}>{typeConfig.icon}</MuiSvgIcon>
                    {typeConfig.label}
                  </span>
                </td>
                <td className="warehouse-table__owner">
                  {getOwnerName(warehouse)}
                </td>
                <td className="warehouse-table__phone">
                  {warehouse.phone || '-'}
                </td>
                <td className="warehouse-table__address">
                  <div className="warehouse-table__address-text" title={warehouse.address || ''}>
                    {warehouse.address || '-'}
                  </div>
                </td>
                <td className="warehouse-table__status">
                  <button
                    className={`warehouse-table__status-badge warehouse-table__status-badge--${warehouse.status ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(warehouse.id, warehouse.status)}
                    disabled={isToggling && togglingId === warehouse.id}
                  >
                    {isToggling && togglingId === warehouse.id ? (
                      <span className="warehouse-table__spinner-small"></span>
                    ) : (
                      <>
                        <span className="warehouse-table__status-dot"></span>
                        {warehouse.status ? 'Activo' : 'Inactivo'}
                      </>
                    )}
                  </button>
                </td>
                <td className="warehouse-table__created-at">
                  {formatDate(warehouse.created_at)}
                </td>
                <td className="warehouse-table__actions">
                  <button
                    className="warehouse-table__action-btn warehouse-table__action-btn--edit"
                    onClick={() => onEdit(warehouse)}
                    title="Editar almacén"
                  >
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                  <button
                    className="warehouse-table__action-btn warehouse-table__action-btn--delete"
                    onClick={() => handleDelete(warehouse.id)}
                    disabled={isDeleting && deletingId === warehouse.id}
                    title="Eliminar almacén"
                  >
                    {isDeleting && deletingId === warehouse.id ? (
                      <span className="warehouse-table__spinner"></span>
                    ) : (
                      <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                    )}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
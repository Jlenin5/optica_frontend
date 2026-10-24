import { useState } from "react"
import { useDeleteStatus } from "../hooks/useDeleteStatus"
import { useToggleStatusStatus } from "../hooks/useToggleStatusStatus"
import type { Status } from "../types/statuses.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface StatusTableProps {
  data: Status[]
  onEdit: (status: Status) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const StatusTable = ({ data, onEdit, onRefresh }: StatusTableProps) => {
  const { mutate: deleteStatus, isPending: isDeleting } = useDeleteStatus()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleStatusStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este estado?")) {
      setDeletingId(id)
      deleteStatus(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleToggleStatus = (id: number, currentIsDefault: boolean) => {
    setTogglingId(id)
    toggleStatus({ id, is_default: !currentIsDefault }, {
      onSuccess: () => {
        onRefresh()
      },
      onSettled: () => {
        setTogglingId(null)
      }
    })
  }

  return (
    <div className="status-table-container">
      <table className="status-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Comprobantes</th>
            <th>Color</th>
            <th>Por Defecto</th>
            <th>Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((status) => {
            const receipts = status?.receipts || []

            return (
              <tr key={status?.id || null}>
                <td className="status-table__status">
                  <div className="status-table__status-info">
                    <div className="status-table__avatar">
                      <span>{status?.code}</span>
                    </div>
                  </div>
                </td>
                <td className="status-table__name">
                  <span className="status-table__name-link">
                    {status?.name}
                  </span>
                </td>
                <td className="status-table__receipts">
                  {receipts.length > 0 ? (
                    <div className="status-table__receipts-list">
                      {receipts.map(receipt => (
                        <span key={receipt.id} className="status-table__receipt-badge">
                          {receipt.description}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="status-table__receipts-empty">Sin comprobantes</span>
                  )}
                </td>
                <td className="status-table__color">
                  {status.color ? (
                    <div className="status-table__color-badge">
                      <span
                        className="status-table__color-dot"
                        style={{ backgroundColor: status.color }}
                        title={status.color}
                      />
                      <span className="status-table__color-hex">{status.color}</span>
                    </div>
                  ) : (
                    <span className="status-table__color-empty">—</span>
                  )}
                </td>
                <td className="status-table__status">
                  <button
                    className={`status-table__status-badge status-table__status-badge--${status?.is_default ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(status?.id, status?.is_default)}
                    disabled={isToggling && togglingId === status?.id}
                  >
                    {isToggling && togglingId === status?.id ? (
                      <span className="status-table__spinner-small"></span>
                    ) : (
                      <>
                        <span className="status-table__status-dot"></span>
                        {status?.is_default ? 'Predeterminado' : 'No predeterminado'}
                      </>
                    )}
                  </button>
                </td>
                <td className="status-table__created-at">
                  {formatDate(status?.created_at)}
                </td>
                <td className="status-table__actions">
                  <button
                    className="status-table__action-btn status-table__action-btn--edit"
                    onClick={() => onEdit(status)}
                    title="Editar estado"
                  >
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                  <button
                    className="status-table__action-btn status-table__action-btn--delete"
                    onClick={() => handleDelete(status?.id)}
                    disabled={isDeleting && deletingId === status?.id}
                    title="Eliminar estado"
                  >
                    {isDeleting && deletingId === status?.id ? (
                      <span className="status-table__spinner"></span>
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

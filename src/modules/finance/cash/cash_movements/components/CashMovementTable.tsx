import { useState } from "react"
import { useDeleteCashMovement } from "../hooks/useDeleteCashMovement"
import type { CashMovement } from "../types/cash-movements.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CashMovementTableProps {
  data: CashMovement[]
  onRefresh: () => void
  onEdit?: (movement: CashMovement) => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

export const CashMovementTable = ({ data, onRefresh, onEdit }: CashMovementTableProps) => {
  const { mutate: deleteMovement, isPending: isDeleting } = useDeleteCashMovement()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
      setDeletingId(id)
      deleteMovement(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const getMovementTypeBadge = (type: string) => {
    if (type === 'income') {
      return (
        <span className="cash-movement-table__type-badge cash-movement-table__type-badge--income">
          <MuiSvgIcon size={14}>lucide:trending-up</MuiSvgIcon>
          Ingreso
        </span>
      )
    }
    return (
      <span className="cash-movement-table__type-badge cash-movement-table__type-badge--expense">
        <MuiSvgIcon size={14}>lucide:trending-down</MuiSvgIcon>
        Egreso
      </span>
    )
  }

  return (
    <div className="cash-movement-table-container">
      <table className="cash-movement-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Fuente</th>
            <th>Monto</th>
            <th>Descripción</th>
            <th>Método Pago</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((movement) => (
            <tr key={movement.id}>
              <td className="cash-movement-table__id">{movement.id}</td>
              <td className="cash-movement-table__type">
                {getMovementTypeBadge(movement.movement_type)}
              </td>
              <td className="cash-movement-table__source">
                {movement.source_display}
              </td>
              <td className={`cash-movement-table__amount cash-movement-table__amount--${movement.movement_type}`}>
                {formatAmount(movement.amount)}
              </td>
              <td className="cash-movement-table__description">
                <div className="cash-movement-table__description-text" title={movement.description || ''}>
                  {movement.description || '-'}
                </div>
              </td>
              <td className="cash-movement-table__payment-method">
                {movement.payment_method?.description || '-'}
              </td>
              <td className="cash-movement-table__created-at">
                {formatDate(movement.created_at)}
              </td>
              <td className="cash-movement-table__actions">
                {!movement.cash_register_session.closed_at && onEdit && (
                  <button
                    className="cash-movement-table__action-btn cash-movement-table__action-btn--edit"
                    onClick={() => onEdit(movement)}
                    title="Editar movimiento"
                  >
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                )}
                {!movement.cash_register_session.closed_at && (
                  <button
                    className="cash-movement-table__action-btn cash-movement-table__action-btn--delete"
                    onClick={() => handleDelete(movement.id)}
                    disabled={isDeleting && deletingId === movement.id}
                    title="Eliminar movimiento"
                  >
                    {isDeleting && deletingId === movement.id ? (
                      <span className="cash-movement-table__spinner"></span>
                    ) : (
                      <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
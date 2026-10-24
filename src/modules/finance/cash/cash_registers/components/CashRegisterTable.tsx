import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteCashRegister } from "../hooks/useDeleteCashRegister"
import type { CashRegister } from "../types/cash-registers.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CashRegisterTableProps {
  data: CashRegister[]
  onRefresh: () => void
  onViewSummary?: (id: number) => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

const formatAmount = (amount: number | null) => {
  if (amount === null) return '-'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

export const CashRegisterTable = ({ data, onRefresh, onViewSummary }: CashRegisterTableProps) => {
  const navigate = useNavigate()
  const { mutate: deleteCashRegister, isPending: isDeleting } = useDeleteCashRegister()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta caja?")) {
      setDeletingId(id)
      deleteCashRegister(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'open') {
      return (
        <span className="cash-register-table__status-badge cash-register-table__status-badge--open">
          <span className="cash-register-table__status-dot"></span>
          Abierta
        </span>
      )
    }
    return (
      <span className="cash-register-table__status-badge cash-register-table__status-badge--closed">
        <span className="cash-register-table__status-dot"></span>
        Cerrada
      </span>
    )
  }

  return (
    <div className="cash-register-table-container">
      <table className="cash-register-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tienda</th>
            <th>Usuario</th>
            <th>Monto Apertura</th>
            <th>Monto Cierre</th>
            <th>Estado</th>
            <th>Fecha Apertura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((register) => (
            <tr key={register.id}>
              <td className="cash-register-table__id">{register.id}</td>
              <td className="cash-register-table__name">
                <div className="cash-register-table__name-info">
                  <div className="cash-register-table__name-icon">
                    <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
                  </div>
                  <span className="cash-register-table__name-text">
                    {register.name || `Caja #${register.id}`}
                  </span>
                </div>
              </td>
              <td className="cash-register-table__store">
                {register.store?.name || '-'}
              </td>
              <td className="cash-register-table__user">
                {register.user?.username || '-'}
              </td>
              <td className="cash-register-table__opening-amount">
                {formatAmount(register.opening_amount)}
              </td>
              <td className="cash-register-table__closing-amount">
                {formatAmount(register.closing_amount)}
              </td>
              <td className="cash-register-table__status">
                {getStatusBadge(register.status)}
              </td>
              <td className="cash-register-table__opened-at">
                {formatDate(register.opened_at)}
              </td>
              <td className="cash-register-table__actions">
                {register.status === 'open' && (
                  <button
                    className="cash-register-table__action-btn cash-register-table__action-btn--close"
                    onClick={() => navigate(`/finance/cash-registers/${register.id}/close`)}
                    title="Cerrar caja"
                  >
                    <MuiSvgIcon size={18}>lucide:lock</MuiSvgIcon>
                  </button>
                )}
                <button
                  className="cash-register-table__action-btn cash-register-table__action-btn--summary"
                  onClick={() => onViewSummary?.(register.id)}
                  title="Ver resumen"
                >
                  <MuiSvgIcon size={18}>lucide:file-text</MuiSvgIcon>
                </button>
                {register.status === 'closed' && (
                  <button
                    className="cash-register-table__action-btn cash-register-table__action-btn--delete"
                    onClick={() => handleDelete(register.id)}
                    disabled={isDeleting && deletingId === register.id}
                    title="Eliminar caja"
                  >
                    {isDeleting && deletingId === register.id ? (
                      <span className="cash-register-table__spinner"></span>
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
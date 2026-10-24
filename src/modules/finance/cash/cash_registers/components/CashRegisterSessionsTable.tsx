import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { CashRegisterSession } from "../types/cash-registers.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CashRegisterSummaryModal } from "./CashRegisterSummaryModal"
import type { User } from "@/modules/users/types/users.types"

interface CashRegisterSessionsTableProps {
  data: CashRegisterSession[]
  onRefresh: () => void
  user: User
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

export const CashRegisterSessionsTable = ({ data, onRefresh, user }: CashRegisterSessionsTableProps) => {
  const navigate = useNavigate()
  const [viewingSummaryId, setViewingSummaryId] = useState<number | null>(null)
  const [openSessionModal, setOpenSessionModal] = useState<CashRegisterSession | null>(null)

  const handleViewSummary = (session: CashRegisterSession) => {
    setViewingSummaryId(session?.id)
    setOpenSessionModal(session)
  }

  const handleCloseSummary = () => {
    setViewingSummaryId(null)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'open') {
      return (
        <span className="cash-register-sessions-table__status-badge cash-register-sessions-table__status-badge--open">
          <span className="cash-register-sessions-table__status-dot"></span>
          Abierta
        </span>
      )
    }
    return (
      <span className="cash-register-sessions-table__status-badge cash-register-sessions-table__status-badge--closed">
        <span className="cash-register-sessions-table__status-dot"></span>
        Cerrada
      </span>
    )
  }

  return (
    <div className="cash-register-sessions-table-container">
      <table className="cash-register-sessions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Caja</th>
            <th>Monto Apertura</th>
            <th>Monto Cierre</th>
            <th>Diferencia</th>
            <th>Estado</th>
            <th>Apertura</th>
            <th>Cierre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((session) => (
            <tr key={session.id}>
              <td className="cash-register-sessions-table__id">{session.id}</td>
              <td className="cash-register-sessions-table__register">
                <div className="cash-register-sessions-table__register-info">
                  <div className="cash-register-sessions-table__register-icon">
                    <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
                  </div>
                  <span>{session.cash_register?.name}</span>
                </div>
              </td>
              <td className="cash-register-sessions-table__opening-amount">
                {formatAmount(session.opening_amount)}
              </td>
              <td className="cash-register-sessions-table__closing-amount">
                {formatAmount(session.closing_amount)}
              </td>
              <td className="cash-register-sessions-table__difference">
                <span className={session.difference_amount !== 0 ? 'cash-register-sessions-table__difference--warning' : ''}>
                  {formatAmount(session.difference_amount)}
                </span>
              </td>
              <td className="cash-register-sessions-table__status">
                {getStatusBadge(session.status)}
              </td>
              <td className="cash-register-sessions-table__opened-at">
                {formatDate(session.opened_at)}
              </td>
              <td className="cash-register-sessions-table__closed-at">
                {session.closed_at ? formatDate(session.closed_at) : '-'}
              </td>
              <td className="cash-register-sessions-table__actions">
                <button
                  className="cash-register-sessions-table__action-btn cash-register-sessions-table__action-btn--summary"
                  onClick={() => handleViewSummary(session)}
                  title="Ver resumen"
                >
                  <MuiSvgIcon size={18}>lucide:file-text</MuiSvgIcon>
                </button>
                {session.status === 'open' && session.user_id === user.id && (
                  <button
                    className="cash-register-sessions-table__action-btn cash-register-sessions-table__action-btn--close"
                    onClick={() => navigate(`/cash-register/sessions/${session.id}/close`)}
                    title="Cerrar caja"
                  >
                    <MuiSvgIcon size={18}>lucide:lock</MuiSvgIcon>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de resumen - implementar según necesidad */}
      {viewingSummaryId && openSessionModal && (
        <CashRegisterSummaryModal
          cashRegisterSession={openSessionModal}
          onClose={handleCloseSummary}
        />
      )}
    </div>
  )
}
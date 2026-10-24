import { useState } from "react"
import { useDeleteReceipt } from "../hooks/useDeleteReceipt"
import { useToggleReceiptStatus } from "../hooks/useToggleReceiptStatus"
import type { Receipt } from "../types/receipts.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToggleRequireSunat } from "../hooks/useToggleRequireSunat"

interface ReceiptTableProps {
  data: Receipt[]
  onEdit: (receipt: Receipt) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

export const ReceiptTable = ({ data, onEdit, onRefresh }: ReceiptTableProps) => {
  const { mutate: deleteReceipt, isPending: isDeleting } = useDeleteReceipt()
  const { mutate: toggleRequireSunat, isPending: isTogglingSunat } = useToggleRequireSunat()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleReceiptStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este recibo?")) {
      setDeletingId(id)
      deleteReceipt(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleToggleRequireSunat = (id: number, currentStatus: boolean) => {
    setTogglingId(id)
    toggleRequireSunat({ id, requires_sunat: !currentStatus }, {
      onSuccess: () => {
        onRefresh()
      },
      onSettled: () => {
        setTogglingId(null)
      }
    })
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

  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="receipt-table-container">
      <table className="receipt-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>SUNAT</th>
            <th>Estado</th>
            <th>Creado por</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((receipt) => (
            <tr key={receipt.id}>
              <td className="receipt-table__id">{receipt.id}</td>
              <td className="receipt-table__description">
                <div className="receipt-table__description-text" title={receipt.description}>
                  {truncateDescription(receipt.description)}
                </div>
              </td>
              <td className="receipt-table__status">
                <button
                  className={`receipt-table__status-badge receipt-table__status-badge--${receipt.requires_sunat ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleRequireSunat(receipt.id, receipt.requires_sunat)}
                  disabled={isTogglingSunat && togglingId === receipt.id}
                >
                  {isTogglingSunat && togglingId === receipt.id ? (
                    <span className="receipt-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="receipt-table__status-dot"></span>
                      {receipt.requires_sunat ? 'Sí' : 'No'}
                    </>
                  )}
                </button>
              </td>
              <td className="receipt-table__status">
                <button
                  className={`receipt-table__status-badge receipt-table__status-badge--${receipt.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(receipt.id, receipt.status)}
                  disabled={isToggling && togglingId === receipt.id}
                >
                  {isToggling && togglingId === receipt.id ? (
                    <span className="receipt-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="receipt-table__status-dot"></span>
                      {receipt.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="receipt-table__created-by">
                {receipt.created_by?.username || 'Sistema'}
              </td>
              <td className="receipt-table__created-at">
                {formatDate(receipt.created_at)}
              </td>
              <td className="receipt-table__actions">
                <button
                  className="receipt-table__action-btn receipt-table__action-btn--edit"
                  onClick={() => onEdit(receipt)}
                  title="Editar"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="receipt-table__action-btn receipt-table__action-btn--delete"
                  onClick={() => handleDelete(receipt.id)}
                  disabled={isDeleting && deletingId === receipt.id}
                  title="Eliminar"
                >
                  {isDeleting && deletingId === receipt.id ? (
                    <span className="receipt-table__spinner"></span>
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
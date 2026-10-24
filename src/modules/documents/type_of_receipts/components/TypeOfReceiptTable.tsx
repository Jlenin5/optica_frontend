import { useState } from "react"
import { useDeleteTypeOfReceipt } from "../hooks/useDeleteTypeOfReceipt"
import { useToggleTypeOfReceiptStatus } from "../hooks/useToggleTypeOfReceiptStatus"
import type { TypeOfReceipt } from "../types/type-of-receipts.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TypeOfReceiptTableProps {
  data: TypeOfReceipt[]
  onEdit: (typeOfReceipt: TypeOfReceipt) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

export const TypeOfReceiptTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: TypeOfReceiptTableProps) => {
  const { mutate: deleteTypeOfReceipt, isPending: isDeleting } = useDeleteTypeOfReceipt()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleTypeOfReceiptStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de recibo?")) {
      setDeletingId(id)
      deleteTypeOfReceipt(id, {
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

  const getDisplayText = (item: TypeOfReceipt) => {
    if (item.description) return item.description
    if (item.serie && item.correlative) return `${item.serie}-${String(item.correlative).padStart(8, '0')}`
    if (item.serie) return item.serie
    return 'Sin descripción'
  }

  return (
    <div className="type-of-receipt-table-container">
      <table className="type-of-receipt-table">
        <thead>
          <tr>
            <th>Descripción / Serie</th>
            <th>Recibo</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Estado</th>
            <th>Creado por</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="type-of-receipt-table__info">
                <div className="type-of-receipt-table__info-text">
                  {getDisplayText(item)}
                </div>
                {item.serie && item.correlative && (
                  <div className="type-of-receipt-table__info-detail">
                    Serie: {item.serie} | Correlativo: {String(item.correlative).padStart(8, '0')}
                  </div>
                )}
              </td>
              <td className="type-of-receipt-table__receipt">
                {item.receipt?.description || '-'}
              </td>
              {
                isSuperAdmin && (
                  <td className="type-of-receipt-table__company">
                    {item.company?.name || '-'}
                  </td>
                )
              }
              <td className="type-of-receipt-table__status">
                <button
                  className={`type-of-receipt-table__status-badge type-of-receipt-table__status-badge--${item.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(item.id, item.status)}
                  disabled={isToggling && togglingId === item.id}
                >
                  {isToggling && togglingId === item.id ? (
                    <span className="type-of-receipt-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="type-of-receipt-table__status-dot"></span>
                      {item.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="type-of-receipt-table__created-by">
                {item.created_by?.username || 'Sistema'}
              </td>
              <td className="type-of-receipt-table__created-at">
                {formatDate(item.created_at)}
              </td>
              <td className="type-of-receipt-table__actions">
                <button
                  className="type-of-receipt-table__action-btn type-of-receipt-table__action-btn--edit"
                  onClick={() => onEdit(item)}
                  title="Editar"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="type-of-receipt-table__action-btn type-of-receipt-table__action-btn--delete"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting && deletingId === item.id}
                  title="Eliminar"
                >
                  {isDeleting && deletingId === item.id ? (
                    <span className="type-of-receipt-table__spinner"></span>
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
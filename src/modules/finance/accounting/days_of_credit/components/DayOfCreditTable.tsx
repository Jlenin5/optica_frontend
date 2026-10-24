import { useState } from "react"
import { useDeleteDayOfCredit } from "../hooks/useDeleteDayOfCredit"
import type { DayOfCredit } from "../types/days-of-credit.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DayOfCreditTableProps {
  data: DayOfCredit[]
  onEdit: (dayOfCredit: DayOfCredit) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const DayOfCreditTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: DayOfCreditTableProps) => {
  const { mutate: deleteDayOfCredit, isPending: isDeleting } = useDeleteDayOfCredit()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este día de crédito?")) {
      setDeletingId(id)
      deleteDayOfCredit(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  return (
    <div className="day-of-credit-table-container">
      <table className="day-of-credit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Días de Crédito</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="day-of-credit-table__id">{item.id}</td>
              <td className="day-of-credit-table__days">
                <div className="day-of-credit-table__days-info">
                  <span className="day-of-credit-table__days-value">
                    {item.amount_in_days ? `${item.amount_in_days} días` : 'Sin especificar'}
                  </span>
                </div>
              </td>
              {
                isSuperAdmin && (
                  <td className="store-registers-table__company">
                    {item?.company?.name || '-'}
                  </td>
                )
              }
              <td className="day-of-credit-table__created-at">
                {formatDate(item.created_at)}
              </td>
              <td className="day-of-credit-table__actions">
                <button
                  className="day-of-credit-table__action-btn day-of-credit-table__action-btn--edit"
                  onClick={() => onEdit(item)}
                  title="Editar día de crédito"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="day-of-credit-table__action-btn day-of-credit-table__action-btn--delete"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting && deletingId === item.id}
                  title="Eliminar día de crédito"
                >
                  {isDeleting && deletingId === item.id ? (
                    <span className="day-of-credit-table__spinner"></span>
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
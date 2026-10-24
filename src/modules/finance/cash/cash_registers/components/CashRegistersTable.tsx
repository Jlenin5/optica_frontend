import { useState } from "react"
import { useDeleteCashRegister } from "../hooks/useDeleteCashRegister"
import type { CashRegister } from "../types/cash-registers.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CashRegistersTableProps {
  data: CashRegister[]
  onEdit: (register: CashRegister) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const CashRegistersTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: CashRegistersTableProps) => {
  const { mutate: deleteRegister, isPending: isDeleting } = useDeleteCashRegister()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta caja? Esta acción no se puede deshacer.")) {
      setDeletingId(id)
      deleteRegister(id, {
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
    <div className="cash-registers-table-container">
      <table className="cash-registers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Tienda</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((register) => (
            <tr key={register.id}>
              <td className="cash-registers-table__id">{register.id}</td>
              <td className="cash-registers-table__name">
                <div className="cash-registers-table__name-info">
                  <div className="cash-registers-table__name-icon">
                    <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
                  </div>
                  <span className="cash-registers-table__name-text">{register.name}</span>
                </div>
              </td>
              {
                isSuperAdmin && (
                  <td className="cash-registers-table__company">
                    {register.company?.name || '-'}
                  </td>
                )
              }
              <td className="cash-registers-table__store">
                {register.store?.name || '-'}
              </td>
              <td className="cash-registers-table__description">
                <div className="cash-registers-table__description-text" title={register.description || ''}>
                  {register.description || '-'}
                </div>
              </td>
              <td className="cash-registers-table__status">
                <span className={`cash-registers-table__status-badge cash-registers-table__status-badge--${register.status ? 'active' : 'inactive'}`}>
                  <span className="cash-registers-table__status-dot"></span>
                  {register.status ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td className="cash-registers-table__created-at">
                {formatDate(register.created_at)}
              </td>
              <td className="cash-registers-table__actions">
                <button
                  className="cash-registers-table__action-btn cash-registers-table__action-btn--edit"
                  onClick={() => onEdit(register)}
                  title="Editar caja"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="cash-registers-table__action-btn cash-registers-table__action-btn--delete"
                  onClick={() => handleDelete(register.id)}
                  disabled={isDeleting && deletingId === register.id}
                  title="Eliminar caja"
                >
                  {isDeleting && deletingId === register.id ? (
                    <span className="cash-registers-table__spinner"></span>
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
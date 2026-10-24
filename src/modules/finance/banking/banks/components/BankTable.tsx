import { useState } from "react"
import { useDeleteBank } from "../hooks/useDeleteBank"
import type { Bank } from "../types/banks.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BankTableProps {
  data: Bank[]
  onEdit: (bank: Bank) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const BankTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: BankTableProps) => {
  const { mutate: deleteBank, isPending: isDeleting } = useDeleteBank()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este banco?")) {
      setDeletingId(id)
      deleteBank(id, {
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
    <div className="bank-table-container">
      <table className="bank-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>RUC</th>
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
          {data.map((bank) => (
            <tr key={bank.id}>
              <td className="bank-table__id">{bank.id}</td>
              <td className="bank-table__name">
                <div className="bank-table__name-info">
                  <div className="bank-table__name-icon">
                    <MuiSvgIcon size={20}>lucide:building</MuiSvgIcon>
                  </div>
                  <span className="bank-table__name-text">{bank.name}</span>
                </div>
              </td>
              <td className="bank-table__description">
                <div className="bank-table__description-text" title={bank.description || ''}>
                  {bank.description || '-'}
                </div>
              </td>
              <td className="bank-table__ruc">
                {bank.ruc || '-'}
              </td>
              {
                isSuperAdmin && (
                  <td className="store-registers-table__company">
                    {bank?.company?.name || '-'}
                  </td>
                )
              }
              <td className="bank-table__created-at">
                {formatDate(bank.created_at)}
              </td>
              <td className="bank-table__actions">
                <button
                  className="bank-table__action-btn bank-table__action-btn--edit"
                  onClick={() => onEdit(bank)}
                  title="Editar banco"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="bank-table__action-btn bank-table__action-btn--delete"
                  onClick={() => handleDelete(bank.id)}
                  disabled={isDeleting && deletingId === bank.id}
                  title="Eliminar banco"
                >
                  {isDeleting && deletingId === bank.id ? (
                    <span className="bank-table__spinner"></span>
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
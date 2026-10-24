import { useState } from "react"
import { useDeleteBranchOffice } from "../hooks/useDeleteBranchOffice"
import { useToggleBranchOfficeStatus } from "../hooks/useToggleBranchOfficeStatus"
import type { BranchOffice } from "../types/branch-offices.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BranchOfficeTableProps {
  data: BranchOffice[]
  onEdit: (branchOffice: BranchOffice) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const BranchOfficeTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: BranchOfficeTableProps) => {
  const { mutate: deleteBranchOffice, isPending: isDeleting } = useDeleteBranchOffice()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleBranchOfficeStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sucursal?")) {
      setDeletingId(id)
      deleteBranchOffice(id, {
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

  return (
    <div className="branch-office-table-container">
      <table className="branch-office-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((branchOffice) => (
            <tr key={branchOffice.id}>
              <td className="branch-office-table__name">
                <div className="branch-office-table__name-info">
                  <span className="branch-office-table__name-text">{branchOffice.name}</span>
                </div>
              </td>
              <td className="branch-office-table__phone">
                {branchOffice.phone || '-'}
              </td>
              <td className="branch-office-table__address">
                <div className="branch-office-table__address-text" title={branchOffice.address || ''}>
                  {branchOffice.address || '-'}
                </div>
              </td>
              {
                isSuperAdmin && (
                  <td className="store-registers-table__company">
                    {branchOffice?.company?.name || '-'}
                  </td>
                )
              }
              <td className="branch-office-table__status">
                <button
                  className={`branch-office-table__status-badge branch-office-table__status-badge--${branchOffice.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(branchOffice.id, branchOffice.status)}
                  disabled={isToggling && togglingId === branchOffice.id}
                >
                  {isToggling && togglingId === branchOffice.id ? (
                    <span className="branch-office-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="branch-office-table__status-dot"></span>
                      {branchOffice.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="branch-office-table__created-at">
                {formatDate(branchOffice.created_at)}
              </td>
              <td className="branch-office-table__actions">
                <button
                  className="branch-office-table__action-btn branch-office-table__action-btn--edit"
                  onClick={() => onEdit(branchOffice)}
                  title="Editar sucursal"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="branch-office-table__action-btn branch-office-table__action-btn--delete"
                  onClick={() => handleDelete(branchOffice.id)}
                  disabled={isDeleting && deletingId === branchOffice.id}
                  title="Eliminar sucursal"
                >
                  {isDeleting && deletingId === branchOffice.id ? (
                    <span className="branch-office-table__spinner"></span>
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
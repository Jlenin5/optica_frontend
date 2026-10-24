import { useState } from "react"
import { useDeleteStore } from "../hooks/useDeleteStore"
import { useToggleStoreStatus } from "../hooks/useToggleStoreStatus"
import type { Store } from "../types/stores.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface StoreTableProps {
  data: Store[]
  onEdit: (store: Store) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const StoreTable = ({
  data,
  onEdit,
  onRefresh,
  isSuperAdmin
}: StoreTableProps) => {
  const { mutate: deleteStore, isPending: isDeleting } = useDeleteStore()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleStoreStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tienda?")) {
      setDeletingId(id)
      deleteStore(id, {
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
    <div className="store-table-container">
      <table className="store-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Sucursal</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((store) => (
            <tr key={store.id}>
              <td className="store-table__name">
                <div className="store-table__name-info">
                  <span className="store-table__name-text">{store.name}</span>
                </div>
              </td>
              <td className="store-table__branch">
                {store.branch_office?.name || '-'}
              </td>
              {
                isSuperAdmin && (
                  <td className="store-registers-table__company">
                    {store.branch_office?.company?.name || '-'}
                  </td>
                )
              }
              <td className="store-table__phone">
                {store.phone || '-'}
              </td>
              <td className="store-table__address">
                <div className="store-table__address-text" title={store.address || ''}>
                  {store.address || '-'}
                </div>
              </td>
              <td className="store-table__status">
                <button
                  className={`store-table__status-badge store-table__status-badge--${store.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(store.id, store.status)}
                  disabled={isToggling && togglingId === store.id}
                >
                  {isToggling && togglingId === store.id ? (
                    <span className="store-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="store-table__status-dot"></span>
                      {store.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="store-table__created-at">
                {formatDate(store.created_at)}
              </td>
              <td className="store-table__actions">
                <button
                  className="store-table__action-btn store-table__action-btn--edit"
                  onClick={() => onEdit(store)}
                  title="Editar tienda"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="store-table__action-btn store-table__action-btn--delete"
                  onClick={() => handleDelete(store.id)}
                  disabled={isDeleting && deletingId === store.id}
                  title="Eliminar tienda"
                >
                  {isDeleting && deletingId === store.id ? (
                    <span className="store-table__spinner"></span>
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
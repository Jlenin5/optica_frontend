import { useState } from "react"
import { useDeleteBrand } from "../hooks/useDeleteBrand"
import { useToggleBrandStatus } from "../hooks/useToggleBrandStatus"
import { useToggleBrandVisibility } from "../hooks/useToggleBrandVisibility"
import type { Brand } from "../types/brands.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BrandTableProps {
  data: Brand[]
  onEdit: (brand: Brand) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const BrandTable = ({ data, onEdit, onRefresh }: BrandTableProps) => {
  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteBrand()
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleBrandStatus()
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleBrandVisibility()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      setDeletingId(id)
      deleteBrand(id, {
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

  const handleToggleVisibility = (id: number, currentVisibility: boolean) => {
    setTogglingId(id)
    toggleVisibility({ id, visible_on_web: !currentVisibility }, {
      onSuccess: () => {
        onRefresh()
      },
      onSettled: () => {
        setTogglingId(null)
      }
    })
  }

  return (
    <div className="brand-table-container">
      <table className="brand-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Descripción</th>
            <th>Sitio Web</th>
            <th>Orden</th>
            <th>Estado</th>
            <th>Web</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((brand) => (
            <tr key={brand.id}>
              <td className="brand-table__id">{brand.id}</td>
              <td className="brand-table__name">
                <div className="brand-table__name-info">
                  <div className="brand-table__avatar">
                    {brand.image ? (
                      <img src={brand.image} alt={brand.name} />
                    ) : (
                      <MuiSvgIcon size={20}>lucide:trademark</MuiSvgIcon>
                    )}
                  </div>
                  <div>
                    <div className="brand-table__name-text">{brand.name}</div>
                  </div>
                </div>
              </td>
              <td className="brand-table__description">
                <div className="brand-table__description-text" title={brand.description || ''}>
                  {brand.description || '-'}
                </div>
              </td>
              <td className="brand-table__website">
                {brand.website_url ? (
                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="brand-table__website-link">
                    <MuiSvgIcon size={14}>lucide:external-link</MuiSvgIcon>
                    Visitar
                  </a>
                ) : '-'}
              </td>
              <td className="brand-table__order">
                {brand.list_order}
              </td>
              <td className="brand-table__status">
                <button
                  className={`brand-table__status-badge brand-table__status-badge--${brand.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(brand.id, brand.status)}
                  disabled={isTogglingStatus && togglingId === brand.id}
                >
                  {isTogglingStatus && togglingId === brand.id ? (
                    <span className="brand-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="brand-table__status-dot"></span>
                      {brand.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="brand-table__visibility">
                <button
                  className={`brand-table__visibility-badge brand-table__visibility-badge--${brand.visible_on_web ? 'visible' : 'hidden'}`}
                  onClick={() => handleToggleVisibility(brand.id, brand.visible_on_web)}
                  disabled={isTogglingVisibility && togglingId === brand.id}
                >
                  <MuiSvgIcon size={14}>
                    {brand.visible_on_web ? 'lucide:eye' : 'lucide:eye-off'}
                  </MuiSvgIcon>
                  {brand.visible_on_web ? 'Visible' : 'Oculta'}
                </button>
              </td>
              <td className="brand-table__created-at">
                {formatDate(brand.created_at)}
              </td>
              <td className="brand-table__actions">
                <button
                  className="brand-table__action-btn brand-table__action-btn--edit"
                  onClick={() => onEdit(brand)}
                  title="Editar marca"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="brand-table__action-btn brand-table__action-btn--delete"
                  onClick={() => handleDelete(brand.id)}
                  disabled={isDeleting && deletingId === brand.id}
                  title="Eliminar marca"
                >
                  {isDeleting && deletingId === brand.id ? (
                    <span className="brand-table__spinner"></span>
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
import { useState } from "react"
import { useDeleteCategory } from "../hooks/useDeleteCategory"
import { useToggleCategoryStatus } from "../hooks/useToggleCategoryStatus"
import { useToggleCategoryVisibility } from "../hooks/useToggleCategoryVisibility"
import type { Category } from "../types/categories.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CategoryTableProps {
  data: Category[]
  onEdit: (category: Category) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const CategoryTable = ({ data, onEdit, onRefresh }: CategoryTableProps) => {
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCategoryStatus()
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleCategoryVisibility()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      setDeletingId(id)
      deleteCategory(id, {
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
    <div className="category-table-container">
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Orden</th>
            <th>Estado</th>
            <th>Web</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) => (
            <tr key={category.id}>
              <td className="category-table__id">{category.id}</td>
              <td className="category-table__name">
                <div className="category-table__name-info">
                  <div className="category-table__avatar">
                    {category.image ? (
                      <img src={category.image} alt={category.name} />
                    ) : (
                      <MuiSvgIcon size={20}>lucide:folder</MuiSvgIcon>
                    )}
                  </div>
                  <div>
                    <div className="category-table__name-text">{category.name}</div>
                    {category.category_father && (
                      <div className="category-table__parent">Padre: ID {category.category_father}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="category-table__description">
                <div className="category-table__description-text" title={category.description || ''}>
                  {category.description || '-'}
                </div>
              </td>
              <td className="category-table__order">
                {category.list_order}
              </td>
              <td className="category-table__status">
                <button
                  className={`category-table__status-badge category-table__status-badge--${category.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(category.id, category.status)}
                  disabled={isTogglingStatus && togglingId === category.id}
                >
                  {isTogglingStatus && togglingId === category.id ? (
                    <span className="category-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="category-table__status-dot"></span>
                      {category.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="category-table__visibility">
                <button
                  className={`category-table__visibility-badge category-table__visibility-badge--${category.visible_on_web ? 'visible' : 'hidden'}`}
                  onClick={() => handleToggleVisibility(category.id, category.visible_on_web)}
                  disabled={isTogglingVisibility && togglingId === category.id}
                >
                  <MuiSvgIcon size={14}>
                    {category.visible_on_web ? 'lucide:eye' : 'lucide:eye-off'}
                  </MuiSvgIcon>
                  {category.visible_on_web ? 'Visible' : 'Oculta'}
                </button>
              </td>
              <td className="category-table__created-at">
                {formatDate(category.created_at)}
              </td>
              <td className="category-table__actions">
                <button
                  className="category-table__action-btn category-table__action-btn--edit"
                  onClick={() => onEdit(category)}
                  title="Editar categoría"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="category-table__action-btn category-table__action-btn--delete"
                  onClick={() => handleDelete(category.id)}
                  disabled={isDeleting && deletingId === category.id}
                  title="Eliminar categoría"
                >
                  {isDeleting && deletingId === category.id ? (
                    <span className="category-table__spinner"></span>
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
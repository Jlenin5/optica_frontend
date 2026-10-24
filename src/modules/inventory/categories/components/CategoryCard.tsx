import { useState } from "react"
import { useDeleteCategory } from "../hooks/useDeleteCategory"
import { useToggleCategoryStatus } from "../hooks/useToggleCategoryStatus"
import { useToggleCategoryVisibility } from "../hooks/useToggleCategoryVisibility"
import type { Category } from "../types/categories.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

const api = import.meta.env.VITE_MEDIA_BASE_URL

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onRefresh: () => void
}

export const CategoryCard = ({ category, onEdit, onRefresh }: CategoryCardProps) => {
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCategoryStatus()
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleCategoryVisibility()
  const [isDeletingLocal, setIsDeletingLocal] = useState(false)

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      setIsDeletingLocal(true)
      deleteCategory(category.id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setIsDeletingLocal(false)
        }
      })
    }
  }

  const handleToggleStatus = () => {
    toggleStatus({ id: category.id, status: !category.status }, {
      onSuccess: () => onRefresh()
    })
  }

  const handleToggleVisibility = () => {
    toggleVisibility({ id: category.id, visible_on_web: !category.visible_on_web }, {
      onSuccess: () => onRefresh()
    })
  }

  return (
    <div className="category-card">
      <div className="category-card__image">
        {category.image ? (
          <img src={api + category.image} alt={category.name} />
        ) : (
          <div className="category-card__image-placeholder">
            <MuiSvgIcon size={32}>lucide:folder</MuiSvgIcon>
          </div>
        )}
      </div>

      <div className="category-card__content">
        <div className="category-card__header">
          <h3 className="category-card__name">{category.name}</h3>
          <div className="category-card__badges">
            <span className={`category-card__badge category-card__badge--${category.status ? 'active' : 'inactive'}`}>
              {category.status ? 'Activo' : 'Inactivo'}
            </span>
            <span className={`category-card__badge category-card__badge--${category.visible_on_web ? 'visible' : 'hidden'}`}>
              {category.visible_on_web ? 'Visible Web' : 'Oculta Web'}
            </span>
          </div>
        </div>

        {category.description && (
          <p className="category-card__description">{category.description}</p>
        )}

        <div className="category-card__details">
          {category.category_father && (
            <div className="category-card__detail">
              <MuiSvgIcon size={14}>lucide:folder-tree</MuiSvgIcon>
              <span>Categoría Padre: ID {category.category_father}</span>
            </div>
          )}
          <div className="category-card__detail">
            <MuiSvgIcon size={14}>lucide:hash</MuiSvgIcon>
            <span>Orden: {category.list_order}</span>
          </div>
        </div>
      </div>

      <div className="category-card__footer">
        <button 
          className="category-card__btn category-card__btn--edit"
          onClick={() => onEdit(category)}
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar
        </button>
        <button 
          className="category-card__btn category-card__btn--visibility"
          onClick={handleToggleVisibility}
          disabled={isTogglingVisibility}
          title={category.visible_on_web ? 'Ocultar en web' : 'Mostrar en web'}
        >
          <MuiSvgIcon size={18}>
            {category.visible_on_web ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
        </button>
        <button 
          className={`category-card__btn category-card__btn--${category.status ? 'disable' : 'enable'}`}
          onClick={handleToggleStatus}
          disabled={isTogglingStatus}
        >
          <MuiSvgIcon size={18}>
            {category.status ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
          {category.status ? 'Desactivar' : 'Activar'}
        </button>
        <button 
          className="category-card__btn category-card__btn--delete"
          onClick={handleDelete}
          disabled={isDeletingLocal}
        >
          {isDeletingLocal ? (
            <span className="category-card__spinner"></span>
          ) : (
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
          )}
        </button>
      </div>
    </div>
  )
}
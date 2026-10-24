import { useState } from "react"
import { useDeleteBrand } from "../hooks/useDeleteBrand"
import { useToggleBrandStatus } from "../hooks/useToggleBrandStatus"
import { useToggleBrandVisibility } from "../hooks/useToggleBrandVisibility"
import type { Brand } from "../types/brands.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

const api = import.meta.env.VITE_MEDIA_BASE_URL

interface BrandCardProps {
  brand: Brand
  onEdit: (brand: Brand) => void
  onRefresh: () => void
}

export const BrandCard = ({ brand, onEdit, onRefresh }: BrandCardProps) => {
  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteBrand()
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleBrandStatus()
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleBrandVisibility()
  const [isDeletingLocal, setIsDeletingLocal] = useState(false)

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      setIsDeletingLocal(true)
      deleteBrand(brand.id, {
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
    toggleStatus({ id: brand.id, status: !brand.status }, {
      onSuccess: () => onRefresh()
    })
  }

  const handleToggleVisibility = () => {
    toggleVisibility({ id: brand.id, visible_on_web: !brand.visible_on_web }, {
      onSuccess: () => onRefresh()
    })
  }

  return (
    <div className="brand-card">
      <div className="brand-card__image">
        {brand.image ? (
          <img src={api + brand.image} alt={brand.name} />
        ) : (
          <div className="brand-card__image-placeholder">
            <MuiSvgIcon size={32}>lucide:trademark</MuiSvgIcon>
          </div>
        )}
      </div>

      <div className="brand-card__content">
        <div className="brand-card__header">
          <h3 className="brand-card__name">{brand.name}</h3>
          <div className="brand-card__badges">
            <span className={`brand-card__badge brand-card__badge--${brand.status ? 'active' : 'inactive'}`}>
              {brand.status ? 'Activo' : 'Inactivo'}
            </span>
            <span className={`brand-card__badge brand-card__badge--${brand.visible_on_web ? 'visible' : 'hidden'}`}>
              {brand.visible_on_web ? 'Visible Web' : 'Oculta Web'}
            </span>
          </div>
        </div>

        {brand.description && (
          <p className="brand-card__description">{brand.description}</p>
        )}

        <div className="brand-card__details">
          {brand.website_url && (
            <div className="brand-card__detail">
              <MuiSvgIcon size={14}>lucide:globe</MuiSvgIcon>
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                {brand.website_url}
              </a>
            </div>
          )}
          <div className="brand-card__detail">
            <MuiSvgIcon size={14}>lucide:hash</MuiSvgIcon>
            <span>Orden: {brand.list_order}</span>
          </div>
        </div>
      </div>

      <div className="brand-card__footer">
        <button 
          className="brand-card__btn brand-card__btn--edit"
          onClick={() => onEdit(brand)}
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar
        </button>
        <button 
          className="brand-card__btn brand-card__btn--visibility"
          onClick={handleToggleVisibility}
          disabled={isTogglingVisibility}
          title={brand.visible_on_web ? 'Ocultar en web' : 'Mostrar en web'}
        >
          <MuiSvgIcon size={18}>
            {brand.visible_on_web ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
        </button>
        <button 
          className={`brand-card__btn brand-card__btn--${brand.status ? 'disable' : 'enable'}`}
          onClick={handleToggleStatus}
          disabled={isTogglingStatus}
        >
          <MuiSvgIcon size={18}>
            {brand.status ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
          {brand.status ? 'Desactivar' : 'Activar'}
        </button>
        <button 
          className="brand-card__btn brand-card__btn--delete"
          onClick={handleDelete}
          disabled={isDeletingLocal}
        >
          {isDeletingLocal ? (
            <span className="brand-card__spinner"></span>
          ) : (
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
          )}
        </button>
      </div>
    </div>
  )
}
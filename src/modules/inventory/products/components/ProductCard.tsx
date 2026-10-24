import { useState } from "react"
import { useDeleteProduct } from "../hooks/useDeleteProduct"
import { useToggleProductStatus } from "../hooks/useToggleProductStatus"
import type { Product } from "../types/products.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onRefresh: () => void
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(price)
}

const getProductTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    product: 'Producto',
    service: 'Servicio',
    lens: 'Lente'
  }
  return labels[type] || type
}

const getProductTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    product: '#3b82f6',
    service: '#8b5cf6',
    lens: '#10b981'
  }
  return colors[type] || '#6b7280'
}

export const ProductCard = ({ product, onEdit, onRefresh }: ProductCardProps) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleProductStatus()
  const [isDeletingLocal, setIsDeletingLocal] = useState(false)

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setIsDeletingLocal(true)
      deleteProduct(product.id, {
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
    toggleStatus({ id: product.id, status: !product.status }, {
      onSuccess: () => onRefresh()
    })
  }

  const productTypeColor = getProductTypeColor(product.product_type)
  const productTypeLabel = getProductTypeLabel(product.product_type)

  return (
    <div className="product-card">
      <div className="product-card__image">
        {product.featured_image ? (
          <img src={product.images?.find(img => img.id === product.featured_image)?.url || '/placeholder-product.png'} alt={product.name} />
        ) : (
          <div className="product-card__image-placeholder">
            <MuiSvgIcon size={32}>lucide:package</MuiSvgIcon>
          </div>
        )}
        <div className="product-card__badges">
          <span className="product-card__type-badge" style={{ backgroundColor: `${productTypeColor}15`, color: productTypeColor }}>
            {productTypeLabel}
          </span>
          <span className={`product-card__status-badge product-card__status-badge--${product.status ? 'active' : 'inactive'}`}>
            {product.status ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="product-card__content">
        <div className="product-card__header">
          <h3 className="product-card__name">{product.name}</h3>
          {product.sku && (
            <span className="product-card__sku">SKU: {product.sku}</span>
          )}
        </div>

        <div className="product-card__details">
          {product.category && (
            <div className="product-card__detail">
              <MuiSvgIcon size={14}>lucide:folder</MuiSvgIcon>
              <span>{product.category.name}</span>
            </div>
          )}
          {product.brand && (
            <div className="product-card__detail">
              <MuiSvgIcon size={14}>lucide:tag</MuiSvgIcon>
              <span>{product.brand.name}</span>
            </div>
          )}
          {product.barcode && (
            <div className="product-card__detail">
              <MuiSvgIcon size={14}>lucide:scan</MuiSvgIcon>
              <span>{product.barcode}</span>
            </div>
          )}
        </div>

        <div className="product-card__price">
          <div className="product-card__current-price">{formatPrice(product.price)}</div>
          {product.cost > 0 && (
            <div className="product-card__cost">Costo: {formatPrice(product.cost)}</div>
          )}
        </div>

        {product.total_stock !== undefined && (
          <div className={`product-card__stock ${product.total_stock <= 10 ? 'product-card__stock--low' : ''}`}>
            <MuiSvgIcon size={14}>lucide:package</MuiSvgIcon>
            <span>Stock: {product.total_stock} unidades</span>
          </div>
        )}

        {product.description && (
          <p className="product-card__description">{product.description.substring(0, 100)}...</p>
        )}
      </div>

      <div className="product-card__footer">
        <button 
          className="product-card__btn product-card__btn--edit"
          onClick={() => onEdit(product)}
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar
        </button>
        <button 
          className={`product-card__btn product-card__btn--${product.status ? 'disable' : 'enable'}`}
          onClick={handleToggleStatus}
          disabled={isToggling}
        >
          <MuiSvgIcon size={18}>
            {product.status ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
          {product.status ? 'Desactivar' : 'Activar'}
        </button>
        <button 
          className="product-card__btn product-card__btn--delete"
          onClick={handleDelete}
          disabled={isDeletingLocal}
        >
          {isDeletingLocal ? (
            <span className="product-card__spinner"></span>
          ) : (
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
          )}
          Eliminar
        </button>
      </div>
    </div>
  )
}
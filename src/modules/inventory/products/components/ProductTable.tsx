import { useState } from "react"
import { useDeleteProduct } from "../hooks/useDeleteProduct"
import { useToggleProductStatus } from "../hooks/useToggleProductStatus"
import type { Product } from "../types/products.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ProductTableProps {
  data: Product[]
  onEdit: (product: Product) => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
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

export const ProductTable = ({ data, onEdit, onRefresh }: ProductTableProps) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleProductStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setDeletingId(id)
      deleteProduct(id, {
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
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>SKU</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td className="product-table__id">{product.id}</td>
              <td className="product-table__name">
                <div className="product-table__name-info">
                  <div className="product-table__avatar">
                    {product.featured_image ? (
                      <img src={product.images?.find(img => img.id === product.featured_image)?.url} alt={product.name} />
                    ) : (
                      <MuiSvgIcon size={20}>lucide:package</MuiSvgIcon>
                    )}
                  </div>
                  <div>
                    <div className="product-table__name-text">{product.name}</div>
                    {product.barcode && (
                      <div className="product-table__barcode">{product.barcode}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="product-table__type">
                <span className="product-table__type-badge">
                  {getProductTypeLabel(product.product_type)}
                </span>
              </td>
              <td className="product-table__sku">
                {product.sku || '-'}
              </td>
              <td className="product-table__category">
                {product.category?.name || '-'}
              </td>
              <td className="product-table__price">
                {formatPrice(product.price)}
              </td>
              <td className="product-table__stock">
                <span className={`product-table__stock-value ${product.total_stock !== undefined && product.total_stock <= 10 ? 'product-table__stock-value--low' : ''}`}>
                  {product.total_stock !== undefined ? product.total_stock : '-'}
                </span>
              </td>
              <td className="product-table__status">
                <button
                  className={`product-table__status-badge product-table__status-badge--${product.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(product.id, product.status)}
                  disabled={isToggling && togglingId === product.id}
                >
                  {isToggling && togglingId === product.id ? (
                    <span className="product-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="product-table__status-dot"></span>
                      {product.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
               </td>
              <td className="product-table__created-at">
                {formatDate(product.created_at)}
               </td>
              <td className="product-table__actions">
                <button
                  className="product-table__action-btn product-table__action-btn--edit"
                  onClick={() => onEdit(product)}
                  title="Editar producto"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="product-table__action-btn product-table__action-btn--delete"
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting && deletingId === product.id}
                  title="Eliminar producto"
                >
                  {isDeleting && deletingId === product.id ? (
                    <span className="product-table__spinner"></span>
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
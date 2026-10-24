import { useState, Fragment } from "react"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import type { DraftSaleDetail } from "../../types/sales.types"

interface ProductDetailSectionProps {
  productsDetail: DraftSaleDetail[]
  handleUpdateProduct: (index: number, field: string, value: string | boolean) => void
  handleRemoveProduct: (index: number) => void
}

const TYPE_LABELS: Record<string, string> = {
  product: 'Producto',
  lens: 'Luna',
  service: 'Servicio'
}

export default function ProductDetailSection({
  productsDetail,
  handleUpdateProduct,
  handleRemoveProduct
}: ProductDetailSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const getItemTypeBadge = (item: DraftSaleDetail) => {
    if (item.lens_type_id) return <span className="sale-form__item-badge sale-form__item-badge--lens">Luna</span>
    if (item.service_id) return <span className="sale-form__item-badge sale-form__item-badge--service">Servicio</span>
    if (item.item_type === 'custom') {
      return <span className="sale-form__item-badge sale-form__item-badge--custom">Personalizado</span>
    }
    const label = item._product ? TYPE_LABELS[item._product.product_type] : null
    if (!label || !item._product) return null
    return <span className={`sale-form__item-badge sale-form__item-badge--${item._product.product_type}`}>{label}</span>
  }

  const getItemDisplayName = (item: DraftSaleDetail) => {
    if (item.item_type === 'custom') return item.custom_name || ''
    if (item.lens_type_id) {
      const name = item._lens_type_name || `Luna #${item.lens_type_id}`
      const lab = item._laboratory_name ? ` (${item._laboratory_name})` : ''
      return `${name}${lab}`
    }
    if (item.service_id) {
      return item._service?.name || `Servicio #${item.service_id}`
    }
    return item._product?.name || ''
  }

  return (
    <div className="sale-form__products-table">
      <table>
        <thead>
          <tr>
            <th>Ítem</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productsDetail.map((product, index) => (
            <Fragment key={index}>
              <tr>
                <td>
                  <div className="sale-form__item-name-cell">
                    {product.item_type === 'custom' ? (
                      <input
                        type="text"
                        value={product.custom_name || ''}
                        onChange={(e) => handleUpdateProduct(index, 'custom_name', e.target.value)}
                        className="sale-form__product-name"
                        placeholder="Nombre del ítem"
                      />
                    ) : (
                      <input
                        type="text"
                        value={getItemDisplayName(product)}
                        readOnly
                        className="sale-form__product-name"
                      />
                    )}
                    <div className="sale-form__item-name-cell__meta">
                      {getItemTypeBadge(product)}
                      {product.item_type === 'custom' && (
                        <button
                          type="button"
                          className="sale-form__item-expand-btn"
                          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                          <MuiSvgIcon size={14}>
                            {expandedIndex === index ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                          </MuiSvgIcon>
                          Especificaciones
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleUpdateProduct(index, 'quantity', e.target.value)}
                    className="sale-form__product-quantity"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price}
                    onChange={(e) => handleUpdateProduct(index, 'price', e.target.value)}
                    className="sale-form__product-price"
                  />
                </td>
                <td>
                  <div className="sale-form__product-discount">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.discount}
                      onChange={(e) => handleUpdateProduct(index, 'discount', e.target.value)}
                      className="sale-form__product-discount-input"
                    />
                    <select
                      value={product.discount_method ? "percentage" : "fixed"}
                      onChange={(e) => handleUpdateProduct(index, 'discount_method', e.target.value === "percentage")}
                      className="sale-form__product-discount-type"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">S/</option>
                    </select>
                  </div>
                </td>
                <td>S/ {product.subtotal.toFixed(2)}</td>
                <td className="sale-form__product-total">S/ {product.total.toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    className="sale-form__remove-product"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <MuiSvgIcon size={16}>lucide:trash-2</MuiSvgIcon>
                  </button>
                </td>
              </tr>
              {product.item_type === 'custom' && expandedIndex === index && (
                <tr className="sale-form__item-specs-row">
                  <td colSpan={7}>
                    <textarea
                      rows={2}
                      placeholder="Material, tratamiento, graduación OD/OI, u otras indicaciones..."
                      value={product.custom_description || ''}
                      onChange={(e) => handleUpdateProduct(index, 'custom_description', e.target.value)}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

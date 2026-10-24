import MuiSvgIcon from '@components/MuiSvgIcon'
import type { TopProduct } from "../types/dashboard.types"

interface TopProductsProps {
  products: TopProduct[]
}

export const TopProducts = ({ products }: TopProductsProps) => {
  return (
    <div className="top-products">
      <div className="top-products__header">
        <h3 className="top-products__title">
          <MuiSvgIcon size={20}>lucide:trending-up</MuiSvgIcon>
          Productos Más Vendidos
        </h3>
      </div>

      <div className="top-products__list">
        {products.length === 0 ? (
          <div className="top-products__empty">
            <MuiSvgIcon size={32}>lucide:package-x</MuiSvgIcon>
            <p>No hay productos registrados</p>
          </div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="top-products__item">
              <div className="top-products__rank">{index + 1}</div>
              <div className="top-products__info">
                <div className="top-products__name">{product.name}</div>
                <div className="top-products__stats">
                  <span className="top-products__sales">
                    <MuiSvgIcon size={12}>lucide:shopping-cart</MuiSvgIcon>
                    {product.sales} ventas
                  </span>
                  <span className="top-products__revenue">
                    <MuiSvgIcon size={12}>lucide:credit-card</MuiSvgIcon>
                    S/ {product.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="top-products__trend">
                <MuiSvgIcon size={16} className="top-products__trend-icon">lucide:arrow-up</MuiSvgIcon>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
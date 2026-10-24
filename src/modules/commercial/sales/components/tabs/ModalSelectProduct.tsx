import { useDebounce } from "@/hooks/useDebounce"
import { useMemo, useState } from "react"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import AutocompleteInput from "@/components/ui/AutocompleteInput"
import "@styles/modules/autocomplete-input.scss"
import { AppModal } from "@/components/ui/modal"
import { useProducts } from "@/modules/inventory/products/hooks/useProducts"
import type { ProductType } from "@/modules/inventory/products/types/products.types"
import type { CreateSaleDetailDTO, Product } from "../../types/sales.types"

interface SelectedCatalogItem extends Partial<CreateSaleDetailDTO> {
  product?: Product
}

interface ModalSelectProductProps {
  productType: ProductType
  title: string
  searchPlaceholder: string
  emptyLabel: string
  onClose: () => void
  onAdd: (item: CreateSaleDetailDTO, product: Product) => void
}

export default function ModalSelectProduct({
  productType,
  title,
  searchPlaceholder,
  emptyLabel,
  onClose,
  onAdd
}: ModalSelectProductProps) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selected, setSelected] = useState<SelectedCatalogItem>({
    quantity: 1,
    discount: 0,
    discount_method: true
  })

  const { data: productsData, isLoading } = useProducts({
    search: debouncedSearch,
    product_type: productType
  })
  const products = productsData?.pages.flatMap(page => page.results) || []

  const quantity = selected.quantity || 1
  const price = selected.price ?? 0
  const discountMethod = selected.discount_method ?? true
  const discountValue = selected.discount || 0
  const subtotal = quantity * price
  const total = discountMethod
    ? subtotal * (1 - discountValue / 100)
    : Math.max(0, subtotal - discountValue)

  const canAdd = !!selected.product_id && price >= 0 && quantity > 0

  const handleAdd = () => {
    if (!canAdd || !selected.product) return
    onAdd({
      item_type: 'catalog',
      product_id: selected.product_id,
      quantity,
      price,
      discount_method: discountMethod,
      discount: discountValue,
      subtotal,
      total
    }, selected.product)
  }

  const selectedLabel = useMemo(() => {
    if (!selected.product) return null
    return selected.product.name
  }, [selected.product])

  return (
    <AppModal
      title={title}
      description="Selecciona un producto del catálogo e indica cantidad y descuento."
      onClose={onClose}
      size="lg"
      footer={
        <div className="sale-form-modal__foot-inner">
          <div className="sale-form-modal__total-chip">
            <span>Total</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
          <div className="sale-form-modal__acts">
            <button type="button" className="sale-form-modal__btn sale-form-modal__btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="sale-form-modal__btn sale-form-modal__btn--primary"
              onClick={handleAdd}
              disabled={!canAdd}
            >
              <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
              Agregar a la venta
            </button>
          </div>
        </div>
      }
    >
      <div className="sale-form-modal">
        <div className="sale-form-modal__field">
          <label>Producto</label>
          <AutocompleteInput
            value={selected.product?.name || search}
            options={products}
            mode="input-register"
            placeholder={searchPlaceholder}
            noOptionsText={emptyLabel}
            loading={isLoading}
            getOptionValue={(product) => product.id}
            getOptionLabel={(product) => product.name}
            filterOption={(product, input) =>
              `${product.name} ${product.sku || ""} ${product.brand?.name || ""}`.toLowerCase().includes(input)
            }
            onChange={(value) => {
              setSearch(value)
              if (selected.product && value !== selected.product.name) {
                setSelected(prev => ({ ...prev, product_id: undefined, product: undefined, price: 0 }))
              }
            }}
            onSelect={(product) => setSelected(prev => ({
              ...prev,
              product_id: product.id,
              product,
              price: product.price
            }))}
            renderOption={(product) => (
              <div>
                <strong>{product.name}</strong>
                <small style={{ display: "block", opacity: 0.7 }}>
                  {product.sku ? `SKU ${product.sku}` : "Sin SKU"} · S/ {Number(product.price).toFixed(2)}
                  {product.brand?.name ? ` · ${product.brand.name}` : ""}
                </small>
              </div>
            )}
          />
        </div>

        {selectedLabel && (
          <div className="sale-form-modal__selected-banner">
            <MuiSvgIcon size={16}>lucide:check-circle-2</MuiSvgIcon>
            Seleccionado: <strong>{selectedLabel}</strong>
          </div>
        )}

        <div className="sale-form-modal__grid">
          <div className="sale-form-modal__field">
            <label>Cantidad</label>
            <input
              type="number"
              step="1"
              min="1"
              value={quantity}
              onChange={(e) => setSelected(prev => ({
                ...prev,
                quantity: Math.max(1, parseFloat(e.target.value) || 1)
              }))}
            />
          </div>
          <div className="sale-form-modal__field">
            <label>Precio unitario</label>
            <div className="sale-form-modal__input-prefix">
              <span>S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setSelected(prev => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          </div>
          <div className="sale-form-modal__field">
            <label>Descuento</label>
            <div className="sale-form-modal__discount">
              <input
                type="number"
                step="0.01"
                min="0"
                value={discountValue}
                onChange={(e) => setSelected(prev => ({
                  ...prev,
                  discount: parseFloat(e.target.value) || 0
                }))}
              />
              <select
                value={discountMethod ? "percentage" : "fixed"}
                onChange={(e) => setSelected(prev => ({
                  ...prev,
                  discount_method: e.target.value === "percentage"
                }))}
              >
                <option value="percentage">%</option>
                <option value="fixed">S/</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  )
}

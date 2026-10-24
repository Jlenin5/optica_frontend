import { useState } from "react"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import { AppModal } from "@/components/ui/modal"
import type { CreateSaleDetailDTO } from "../../types/sales.types"

interface ModalCustomItemProps {
  onClose: () => void
  onAdd: (item: CreateSaleDetailDTO) => void
}

export default function ModalCustomItem({ onClose, onAdd }: ModalCustomItemProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [price, setPrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [discountMethod, setDiscountMethod] = useState<boolean>(true)
  const [error, setError] = useState("")

  const subtotal = quantity * price
  const total = discountMethod
    ? subtotal * (1 - discount / 100)
    : Math.max(0, subtotal - discount)

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Ingrese un nombre para el ítem")
      return
    }
    if (price <= 0) {
      setError("Ingrese un precio válido")
      return
    }

    onAdd({
      item_type: 'custom',
      product_id: null,
      custom_name: name.trim(),
      custom_description: description.trim() || null,
      quantity: quantity || 1,
      price,
      discount_method: discountMethod,
      discount,
      subtotal,
      total
    })
  }

  return (
    <AppModal
      title="Producto personalizado"
      description="Para ítems fuera de catálogo: lunas a medida, trabajos especiales, etc."
      onClose={onClose}
      size="md"
      footer={
        <div className="sale-form-modal__foot-inner">
          <div className="sale-form-modal__total-chip">
            <span>Total</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
          <div className="sale-form-modal__acts">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="sale-form-modal__btn sale-form-modal__btn--primary"
              onClick={handleAdd}
            >
              <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
              Agregar a la venta
            </button>
          </div>
        </div>
      }
    >
      <div className="sale-form-modal">
        <div className="sale-form-modal__hint">
          <MuiSvgIcon size={16}>lucide:sparkles</MuiSvgIcon>
          <span>
            Úsalo cuando el ítem no existe en el catálogo de productos ni de servicios.
          </span>
        </div>

        {error && (
          <div className="sale-form-modal__error">
            <MuiSvgIcon size={16}>lucide:alert-circle</MuiSvgIcon>
            {error}
          </div>
        )}

        <div className="sale-form-modal__field">
          <label>Nombre del ítem <span className="required">*</span></label>
          <input
            type="text"
            placeholder="Ej: Luna personalizada alto índice 1.67"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError("")
            }}
            autoFocus
          />
        </div>

        <div className="sale-form-modal__field">
          <label>Descripción / especificaciones</label>
          <textarea
            rows={3}
            placeholder="Material, tratamiento, graduación OD/OI, indicaciones especiales..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="sale-form-modal__grid">
          <div className="sale-form-modal__field">
            <label>Cantidad</label>
            <input
              type="number"
              step="1"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
            />
          </div>
          <div className="sale-form-modal__field">
            <label>Precio unitario <span className="required">*</span></label>
            <div className="sale-form-modal__input-prefix">
              <span>S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(parseFloat(e.target.value) || 0)
                  if (error) setError("")
                }}
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
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
              <select
                value={discountMethod ? "percentage" : "fixed"}
                onChange={(e) => setDiscountMethod(e.target.value === "percentage")}
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

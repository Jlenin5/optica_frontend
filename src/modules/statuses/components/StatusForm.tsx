import { useState, useEffect } from "react"
import type { CreateStatusDTO, Status } from "../types/statuses.types"
import { useReceipts } from "@/modules/documents/receipts/hooks/useReceipts"

// Paleta de colores predefinida (hexadecimales)
const PRESET_COLORS = [
  "#EF4444", // Rojo
  "#F59E0B", // Ámbar
  "#10B981", // Verde esmeralda
  "#3B82F6", // Azul
  "#8B5CF6", // Violeta
  "#EC4899", // Rosa
  "#F97316", // Naranja
  "#14B8A6", // Turquesa
  "#6366F1", // Índigo
  "#84CC16", // Lima
  "#F43F5E", // Rosa fuerte
  "#6B7280", // Gris
] as const

interface StatusFormProps {
  onSubmit: (data: CreateStatusDTO) => void
  initialData?: Status | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

interface StatusFormState {
  code: string
  name: string
  color: string
  is_default: boolean
  receipt_ids: number[]
}

const buildInitialState = (initialData?: Status | null): StatusFormState => {
  if (!initialData) {
    return {
      code: "",
      name: "",
      color: "",
      is_default: false,
      receipt_ids: [],
    }
  }

  const receiptIds =
    initialData.receipt_ids ??
    initialData.receipts?.map((receipt) => receipt.id) ??
    []

  return {
    code: initialData.code || "",
    name: initialData.name || "",
    color: initialData.color || "",
    is_default: initialData.is_default ?? false,
    receipt_ids: receiptIds,
  }
}

export const StatusForm = ({
  onSubmit,
  initialData,
  onCancel,
  isEditing,
  isSubmitting = false,
}: StatusFormProps) => {
  const [formData, setFormData] = useState<StatusFormState>(() => buildInitialState(initialData))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { data: receiptsData, isLoading: receiptsLoading } = useReceipts()
  const receipts = (receiptsData?.pages.flatMap(page => page.results) || [])
    .filter(receipt => receipt.status !== false)

  // Cargar datos iniciales
  useEffect(() => {
    setFormData(buildInitialState(initialData))
  }, [initialData])

  // Validación
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = "El código es requerido"
    } else if (formData.code.length < 2) {
      newErrors.code = "El código debe tener al menos 2 caracteres"
    }

    if (!formData.name.trim()) {
      newErrors.name = "La descripción es requerida"
    } else if (formData.name.length < 3) {
      newErrors.name = "La descripción debe tener al menos 3 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  // Selección de color desde la paleta
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }))
    if (errors.color) {
      setErrors(prev => ({ ...prev, color: "" }))
    }
  }

  // Alternar un comprobante dentro de la selección múltiple
  const handleReceiptToggle = (receiptId: number) => {
    setFormData(prev => {
      const isSelected = prev.receipt_ids.includes(receiptId)
      return {
        ...prev,
        receipt_ids: isSelected
          ? prev.receipt_ids.filter(id => id !== receiptId)
          : [...prev.receipt_ids, receiptId],
      }
    })
  }

  const handleClearReceipts = () => {
    setFormData(prev => ({ ...prev, receipt_ids: [] }))
  }

  if (receiptsLoading) {
    return (
      <div className="status-form__loading">
        <div className="status-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form className="status-form" onSubmit={handleSubmit}>
      <div className="status-form__section">
        <h4 className="status-form__section-title">Información del Estado</h4>

        {/* Fila 1: Código + Descripción */}
        <div className="status-form__row">
          <div className="status-form__field">
            <label className="status-form__label">
              Código <span className="status-form__required">*</span>
            </label>
            <input
              type="text"
              name="code"
              placeholder="Ej: PEND, APROB, RECHAZ"
              className={`status-form__input ${errors.code ? "status-form__input--error" : ""}`}
              value={formData.code}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.code && <span className="status-form__error">{errors.code}</span>}
          </div>

          <div className="status-form__field">
            <label className="status-form__label">
              Descripción <span className="status-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre descriptivo del estado"
              className={`status-form__input ${errors.name ? "status-form__input--error" : ""}`}
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && <span className="status-form__error">{errors.name}</span>}
          </div>
        </div>

        {/* Comprobantes: selección múltiple */}
        <div className="status-form__field status-form__field--full">
          <label className="status-form__label">
            Comprobantes
            {formData.receipt_ids.length > 0 && (
              <span className="status-form__label-count">
                {formData.receipt_ids.length} seleccionado{formData.receipt_ids.length === 1 ? "" : "s"}
              </span>
            )}
          </label>

          {receipts.length > 0 ? (
            <div className="status-form__receipts">
              <div className="status-form__receipts-list">
                {receipts.map(receipt => {
                  const selected = formData.receipt_ids.includes(receipt.id)
                  return (
                    <button
                      key={receipt.id}
                      type="button"
                      className={`status-form__receipt-chip ${
                        selected ? "status-form__receipt-chip--selected" : ""
                      }`}
                      onClick={() => handleReceiptToggle(receipt.id)}
                      disabled={isSubmitting}
                      aria-pressed={selected}
                    >
                      <span className="status-form__receipt-chip-check">
                        {selected ? "✓" : ""}
                      </span>
                      {receipt.description}
                    </button>
                  )
                })}
              </div>
              {formData.receipt_ids.length > 0 && (
                <button
                  type="button"
                  className="status-form__receipts-clear"
                  onClick={handleClearReceipts}
                  disabled={isSubmitting}
                >
                  Quitar todos
                </button>
              )}
            </div>
          ) : (
            <p className="status-form__receipts-empty">No hay comprobantes disponibles</p>
          )}
          <small className="status-form__helper">
            Selecciona uno o varios comprobantes que utilizarán este estado
          </small>
        </div>

        {/* Color + Por defecto */}
        <div className="status-form__row">
          <div className="status-form__field">
            <label className="status-form__label">Color (opcional)</label>
            <div className="status-form__color-picker">
              {/* Paleta de colores */}
              <div className="status-form__color-palette">
                {PRESET_COLORS.map(hex => (
                  <button
                    key={hex}
                    type="button"
                    className={`status-form__color-swatch ${
                      formData.color === hex ? "status-form__color-swatch--selected" : ""
                    }`}
                    style={{ backgroundColor: hex }}
                    onClick={() => handleColorSelect(hex)}
                    title={hex}
                    aria-label={`Seleccionar color ${hex}`}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
              {/* Previsualización del color seleccionado + input nativo */}
              <div className="status-form__color-actions">
                <div
                  className="status-form__color-preview"
                  style={{
                    backgroundColor: formData.color || "#ffffff",
                    border: formData.color ? "2px solid #e5e7eb" : "2px dashed #d1d5db",
                  }}
                >
                  {!formData.color && <span>?</span>}
                </div>
                <label className="status-form__color-native-label">
                  <input
                    type="color"
                    name="color"
                    value={formData.color || "#000000"}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="status-form__color-native"
                  />
                  <span>Selector libre</span>
                </label>
              </div>
            </div>
            {errors.color && <span className="status-form__error">{errors.color}</span>}
          </div>

          <div className="status-form__row__field status-form__row__field--checkbox">
            <div className="status-form__row__box">
              <label className="status-form__row__checkbox-label">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="status-form__row__checkbox-input"
                />
                <span className="status-form__row__toggle">
                  <span className="status-form__row__toggle-slider"></span>
                </span>
              </label>
              <span className="status-form__row__checkbox-text">
                Por Defecto
              </span>
            </div>
            <small className="status-form__row__helper">
              Marcar si este estado será el predeterminado para nuevos comprobantes
            </small>
          </div>
        </div>
      </div>
    </form>
  )
}

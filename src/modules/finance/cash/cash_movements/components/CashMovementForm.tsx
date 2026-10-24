import { useState, useEffect } from "react"
import { usePaymentMethods } from "@/modules/finance/payments/payment_methods/hooks/usePaymentMethods"
import { useAuthStore } from "@/app/store/auth.store"
import type { CashMovement, MovementType, SourceType } from "../types/cash-movements.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { CashRegisterSession } from "../../cash_registers/types/cash-registers.types"

interface CashMovementFormProps {
  onSubmit: (data: any) => void
  initialData?: CashMovement | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
  activeSession: CashRegisterSession
}

const MOVEMENT_TYPES: { value: MovementType; label: string; icon: string; color: string }[] = [
  { value: 'income', label: 'Ingreso', icon: 'lucide:trending-up', color: '#10b981' },
  { value: 'expense', label: 'Egreso', icon: 'lucide:trending-down', color: '#ef4444' }
]

// Configuración de fuentes con sus propiedades
const SOURCE_CONFIG: Record<SourceType, { 
  label: string; 
  icon: string; 
  description: string;
  requiresReference: boolean;
  allowedMovementTypes: MovementType[];
  requiresJustification?: boolean;
}> = {
  sale: {
    label: 'Venta',
    icon: 'lucide:shopping-cart',
    description: 'Registra el pago de una venta realizada',
    requiresReference: true,
    allowedMovementTypes: ['income'],
    requiresJustification: false
  },
  payment: {
    label: 'Pago de Cliente',
    icon: 'lucide:credit-card',
    description: 'Registra el pago de un cliente por servicios o productos',
    requiresReference: true,
    allowedMovementTypes: ['income'],
    requiresJustification: false
  },
  manual: {
    label: 'Movimiento Manual',
    icon: 'lucide:edit-3',
    description: 'Registro manual de un movimiento de caja',
    requiresReference: false,
    allowedMovementTypes: ['income', 'expense'],
    requiresJustification: false
  },
  expense: {
    label: 'Gasto',
    icon: 'lucide:receipt',
    description: 'Registro de gastos operativos',
    requiresReference: false,
    allowedMovementTypes: ['expense'],
    requiresJustification: true
  },
  adjustment: {
    label: 'Ajuste de Caja',
    icon: 'lucide:calculator',
    description: 'Ajuste manual del saldo de caja (requiere justificación)',
    requiresReference: false,
    allowedMovementTypes: ['income', 'expense'],
    requiresJustification: true
  }
}

// Categorías de gasto
const EXPENSE_CATEGORIES = [
  { value: 'rent', label: 'Alquiler', icon: 'lucide:building' },
  { value: 'utilities', label: 'Servicios', icon: 'lucide:zap' },
  { value: 'salaries', label: 'Salarios', icon: 'lucide:users' },
  { value: 'supplies', label: 'Insumos', icon: 'lucide:package' },
  { value: 'maintenance', label: 'Mantenimiento', icon: 'lucide:wrench' },
  { value: 'marketing', label: 'Marketing', icon: 'lucide:megaphone' },
  { value: 'taxes', label: 'Impuestos', icon: 'lucide:file-text' },
  { value: 'other', label: 'Otros', icon: 'lucide:more-horizontal' }
]

export const CashMovementForm = ({ 
  onSubmit,
  initialData,
  onCancel,
  isEditing,
  isSubmitting,
  activeSession
}: CashMovementFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } = usePaymentMethods()
  
  const [formData, setFormData] = useState({
    movement_type: "income" as MovementType,
    source: "manual" as SourceType,
    amount: "",
    description: "",
    payment_method_id: "",
    expense_category: "",
    justification: "",
    reference_id: "",
    reference_type: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showJustification, setShowJustification] = useState(false)
  const [showReference, setShowReference] = useState(false)

  const paymentMethods = paymentMethodsData?.pages.flatMap(page => page.results) || []
  
  const currentSourceConfig = SOURCE_CONFIG[formData.source]
  // const currentMovementType = MOVEMENT_TYPES.find(t => t.value === formData.movement_type)

  useEffect(() => {
    if (initialData) {
      setFormData({
        movement_type: initialData.movement_type || "income",
        source: initialData.source || "manual",
        amount: initialData.amount?.toString() || "",
        description: initialData.description || "",
        payment_method_id: initialData.payment_method_id?.toString() || "",
        expense_category: "",
        justification: "",
        reference_id: initialData.reference_id?.toString() || "",
        reference_type: initialData.reference_type || ""
      })
    }
  }, [initialData])

  // Actualizar visibilidad de campos según la fuente seleccionada
  useEffect(() => {
    if (currentSourceConfig) {
      setShowJustification(currentSourceConfig.requiresJustification || false)
      setShowReference(currentSourceConfig.requiresReference || false)
      
      // Auto-seleccionar tipo de movimiento según la fuente
      if (currentSourceConfig.allowedMovementTypes.length === 1) {
        setFormData(prev => ({
          ...prev,
          movement_type: currentSourceConfig.allowedMovementTypes[0]
        }))
      }
    }
  }, [formData.source, currentSourceConfig])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.amount) {
      newErrors.amount = "El monto es requerido"
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount)) {
        newErrors.amount = "Ingrese un valor numérico válido"
      } else if (amount <= 0) {
        newErrors.amount = "El monto debe ser mayor a 0"
      }
    }
    
    if (!activeSession && !isEditing) {
      newErrors.register = "No hay una caja activa para registrar movimientos"
    }
    
    // Validación para gastos
    if (formData.source === 'expense' && !formData.expense_category) {
      newErrors.expense_category = "Debe seleccionar una categoría de gasto"
    }
    
    // Validación para ajustes y gastos
    if (showJustification && !formData.justification) {
      newErrors.justification = "Debe proporcionar una justificación para este movimiento"
    }
    
    // Validación para referencias (ventas, pagos)
    if (showReference && !formData.reference_id) {
      newErrors.reference_id = "Debe seleccionar una referencia"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      movement_type: formData.movement_type,
      source: formData.source,
      amount: parseFloat(formData.amount),
      description: formData.description || null,
      payment_method_id: formData.payment_method_id ? parseInt(formData.payment_method_id) : null,
      cash_register_id: activeSession?.cash_register?.id,
      cash_register_session_id: activeSession?.id,
      company_id: isSuperAdmin ? currentCompanyId : user?.company_id,
      // Campos adicionales según la fuente
      ...(formData.source === 'expense' && { expense_category: formData.expense_category }),
      ...(showJustification && { justification: formData.justification }),
      ...(showReference && { 
        reference_id: formData.reference_id ? parseInt(formData.reference_id) : null,
        reference_type: formData.source === 'sale' ? 'sale' : 'payment'
      })
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Filtrar fuentes disponibles según el tipo de movimiento seleccionado
  const availableSources = Object.entries(SOURCE_CONFIG)
    .filter(([_, config]) => config.allowedMovementTypes.includes(formData.movement_type))
    .map(([value, config]) => ({ value: value as SourceType, ...config }))

  if (paymentMethodsLoading) {
    return (
      <div className="cash-movement-form__loading">
        <div className="cash-movement-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  if (!activeSession && !isEditing) {
    return (
      <div className="cash-movement-form__error">
        <MuiSvgIcon size={32}>lucide:alert-circle</MuiSvgIcon>
        <h3>No hay caja activa</h3>
        <p>Debes abrir una caja antes de registrar movimientos</p>
        <button onClick={onCancel}>Cerrar</button>
      </div>
    )
  }

  return (
    <form className="cash-movement-form" onSubmit={handleSubmit}>
      <div className="cash-movement-form__section">
        <div className="cash-movement-form__row">
          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">
              Tipo de Movimiento <span className="cash-movement-form__required">*</span>
            </label>
            <div className="cash-movement-form__type-selector">
              {MOVEMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`cash-movement-form__type-btn ${formData.movement_type === type.value ? 'cash-movement-form__type-btn--active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, movement_type: type.value }))}
                  style={{
                    borderColor: formData.movement_type === type.value ? type.color : undefined,
                    backgroundColor: formData.movement_type === type.value ? `${type.color}15` : undefined,
                    color: formData.movement_type === type.value ? type.color : undefined
                  }}
                >
                  <MuiSvgIcon size={18}>{type.icon}</MuiSvgIcon>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">
              Fuente <span className="cash-movement-form__required">*</span>
            </label>
            <select
              name="source"
              className="cash-movement-form__select"
              value={formData.source}
              onChange={handleChange}
            >
              {availableSources.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
            <p className="cash-movement-form__helper">
              {currentSourceConfig?.description}
            </p>
          </div>
        </div>

        {/* Campos específicos para Gastos */}
        {formData.source === 'expense' && (
          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">
              Categoría de Gasto <span className="cash-movement-form__required">*</span>
            </label>
            <select
              name="expense_category"
              className={`cash-movement-form__select ${errors.expense_category ? 'error' : ''}`}
              value={formData.expense_category}
              onChange={handleChange}
            >
              <option value="">Seleccionar categoría</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.expense_category && <span className="cash-movement-form__error">{errors.expense_category}</span>}
          </div>
        )}

        {/* Referencia para Ventas o Pagos */}
        {showReference && (
          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">
              {formData.source === 'sale' ? 'Número de Venta' : 'Número de Pago'} <span className="cash-movement-form__required">*</span>
            </label>
            <input
              type="text"
              name="reference_id"
              className={`cash-movement-form__input ${errors.reference_id ? 'error' : ''}`}
              value={formData.reference_id}
              onChange={handleChange}
              placeholder={formData.source === 'sale' ? 'Ingrese el ID de la venta' : 'Ingrese el ID del pago'}
            />
            {errors.reference_id && <span className="cash-movement-form__error">{errors.reference_id}</span>}
            <p className="cash-movement-form__helper">
              {formData.source === 'sale' 
                ? 'El monto y método de pago se validarán con la venta seleccionada' 
                : 'El monto y método de pago se validarán con el pago seleccionado'}
            </p>
          </div>
        )}

        <div className="cash-movement-form__row">
          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">
              Monto <span className="cash-movement-form__required">*</span>
            </label>
            <div className="cash-movement-form__amount-input">
              <span className="cash-movement-form__currency">S/</span>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`cash-movement-form__input ${errors.amount ? 'error' : ''}`}
                value={formData.amount}
                onChange={handleChange}
                disabled={showReference && !!formData.reference_id}
              />
            </div>
            {errors.amount && <span className="cash-movement-form__error">{errors.amount}</span>}
          </div>

          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">Método de Pago</label>
            <select
              name="payment_method_id"
              className="cash-movement-form__select"
              value={formData.payment_method_id}
              onChange={handleChange}
              disabled={showReference && !!formData.reference_id}
            >
              <option value="">Seleccionar método de pago</option>
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cash-movement-form__field">
          <label className="cash-movement-form__label">Descripción</label>
          <textarea
            name="description"
            className="cash-movement-form__textarea"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción del movimiento..."
          />
        </div>

        {/* Justificación para Ajustes y Gastos */}
        {showJustification && (
          <div className="cash-movement-form__field">
            <label className="cash-movement-form__label">
              Justificación <span className="cash-movement-form__required">*</span>
            </label>
            <textarea
              name="justification"
              className={`cash-movement-form__textarea ${errors.justification ? 'error' : ''}`}
              value={formData.justification}
              onChange={handleChange}
              rows={2}
              placeholder={formData.source === 'expense' 
                ? 'Explique el motivo del gasto...' 
                : 'Explique el motivo del ajuste...'}
            />
            {errors.justification && <span className="cash-movement-form__error">{errors.justification}</span>}
          </div>
        )}

        {activeSession && !isEditing && (
          <div className="cash-movement-form__info">
            <MuiSvgIcon size={16}>lucide:info</MuiSvgIcon>
            <span>Caja activa: {activeSession.cash_register?.name}</span>
          </div>
        )}
      </div>

      <div className="cash-movement-form__actions">
        <button
          type="button"
          className="cash-movement-form__btn cash-movement-form__btn--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="cash-movement-form__btn cash-movement-form__btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="cash-movement-form__spinner"></span>
              {isEditing ? 'Actualizando...' : 'Registrando...'}
            </>
          ) : (
            isEditing ? 'Actualizar Movimiento' : 'Registrar Movimiento'
          )}
        </button>
      </div>
    </form>
  )
}
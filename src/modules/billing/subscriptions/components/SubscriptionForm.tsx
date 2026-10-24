import { useState, useEffect, useCallback, useRef } from "react"
import { useCompanies } from "@companies/hooks/useCompanies"
import { usePlans } from "@plans/hooks/usePlans"
import type { Plan } from "@plans/types/plans.types"
import type { SubscriptionStatus } from "../types/subscriptions.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"

interface SubscriptionFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
  initialData?: any
}

export const SubscriptionForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting,
  initialData 
}: SubscriptionFormProps) => {
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    limit: 100,
    offset: 0,
    status: true
  })
  const { data: plansData, isLoading: plansLoading } = usePlans({ status: true })
  
  const [formData, setFormData] = useState({
    company_id: initialData?.company_id || '',
    plan_id: initialData?.plan_id || '',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date || '',
    trial_end: initialData?.trial_end || '',
    status: (initialData?.status as SubscriptionStatus) || 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const isCalculatingRef = useRef(false) // Para evitar ciclos infinitos

  const companies = companiesData?.results || []
  const plans = plansData?.pages.flatMap(page => page.results) || []

  // Función para calcular fecha de fin basada en el plan y fecha de inicio
  const calculateEndDate = useCallback((plan: Plan | undefined, startDate: string) => {
    if (!plan || !startDate) return ''
    
    const startDateObj = new Date(startDate)
    let endDateObj = new Date(startDateObj)
    
    switch (plan.billing_cycle) {
      case 'monthly':
        endDateObj.setMonth(endDateObj.getMonth() + 1)
        break
      case 'quarterly':
        endDateObj.setMonth(endDateObj.getMonth() + 3)
        break
      case 'semiannual':
        endDateObj.setMonth(endDateObj.getMonth() + 6)
        break
      case 'annual':
        endDateObj.setFullYear(endDateObj.getFullYear() + 1)
        break
      default:
        return ''
    }
    
    return endDateObj.toISOString().split('T')[0]
  }, [])

  // Efecto para actualizar el plan seleccionado
  useEffect(() => {
    if (formData.plan_id) {
      const plan = plans.find(p => p.id === Number(formData.plan_id))
      setSelectedPlan(plan || null)
    } else {
      setSelectedPlan(null)
    }
  }, [formData.plan_id, plans])

  // Efecto para calcular la fecha de fin cuando cambia el plan o la fecha de inicio
  useEffect(() => {
    // Evitar recalcular si ya estamos en medio de un cálculo
    if (isCalculatingRef.current) return
    
    if (selectedPlan && formData.start_date) {
      isCalculatingRef.current = true
      
      const newEndDate = calculateEndDate(selectedPlan, formData.start_date)
      
      // Solo actualizar si la fecha de fin es diferente
      if (newEndDate !== formData.end_date) {
        setFormData(prev => ({
          ...prev,
          end_date: newEndDate
        }))
      }
      
      isCalculatingRef.current = false
    }
  }, [selectedPlan, formData.start_date, calculateEndDate, formData.end_date])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.company_id) {
      newErrors.company_id = 'Seleccione una empresa'
    }

    if (!formData.plan_id) {
      newErrors.plan_id = 'Seleccione un plan'
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Seleccione la fecha de inicio'
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Seleccione la fecha de fin'
    } else {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      if (endDate <= startDate) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      company_id: Number(formData.company_id),
      plan_id: Number(formData.plan_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      trial_end: formData.trial_end || null,
      status: formData.status
    }

    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (companiesLoading || plansLoading) {
    return (
      <div className="subscription-form__loading">
        <div className="subscription-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="subscription-form">
      <div className="subscription-form__section">
        <div className="subscription-form__row">
          <div className="subscription-form__field">
            <label htmlFor="company_id">Empresa *</label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              className={errors.company_id ? 'error' : ''}
            >
              <option value="">Seleccione una empresa</option>
              {companies.filter(c => c.status).map(company => (
                <option key={company.id} value={company.id}>
                  {company.name} - {company.ruc}
                </option>
              ))}
            </select>
            {errors.company_id && <span className="subscription-form__error">{errors.company_id}</span>}
          </div>

          <div className="subscription-form__field">
            <label htmlFor="plan_id">Plan *</label>
            <select
              id="plan_id"
              name="plan_id"
              value={formData.plan_id}
              onChange={handleChange}
              className={errors.plan_id ? 'error' : ''}
            >
              <option value="">Seleccione un plan</option>
              {plans.filter(p => p.status).map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - S/ {plan.price}/{plan.billing_cycle === 'monthly' ? 'mes' : plan.billing_cycle}
                </option>
              ))}
            </select>
            {errors.plan_id && <span className="subscription-form__error">{errors.plan_id}</span>}
          </div>
        </div>

        {selectedPlan && selectedPlan.description && (
          <div className="subscription-form__plan-info">
            <div className="subscription-form__plan-description">
              <MuiSvgIcon size={18}>lucide:info</MuiSvgIcon>
              <span>{selectedPlan.description}</span>
            </div>
          </div>
        )}

        <div className="subscription-form__row">
          <div className="subscription-form__field">
            <label htmlFor="start_date">Fecha de Inicio *</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={errors.start_date ? 'error' : ''}
            />
            {errors.start_date && <span className="subscription-form__error">{errors.start_date}</span>}
          </div>

          <div className="subscription-form__field">
            <label htmlFor="end_date">Fecha de Fin *</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              readOnly
              className={errors.end_date ? 'error' : ''}
            />
            {errors.end_date && <span className="subscription-form__error">{errors.end_date}</span>}
            <p className="subscription-form__helper">
              Se calcula automáticamente según el ciclo del plan
            </p>
          </div>
        </div>

        <div className="subscription-form__row">
          <div className="subscription-form__field">
            <label htmlFor="trial_end">Fecha Fin Trial (opcional)</label>
            <input
              type="date"
              id="trial_end"
              name="trial_end"
              value={formData.trial_end}
              onChange={handleChange}
            />
            <p className="subscription-form__helper">
              Dejar vacío si no aplica período de prueba
            </p>
          </div>

          <div className="subscription-form__field">
            <label htmlFor="status">Estado Inicial</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Activa</option>
              <option value="trial">Trial</option>
              <option value="past_due">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="subscription-form__actions">
        <button 
          type="button" 
          className="subscription-form__cancel" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="subscription-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="subscription-form__spinner"></span>
              Creando...
            </>
          ) : (
            'Guardar'
          )}
        </button>
      </div>
    </form>
  )
}
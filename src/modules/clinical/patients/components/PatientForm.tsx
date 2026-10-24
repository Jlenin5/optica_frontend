import { useState, useEffect } from "react"
import { useTypeOfDocuments } from "@/modules/documents/type-of-documents/hooks/useTypeOfDocuments"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"
import { useAuthStore } from "@/app/store/auth.store"
import type { Patient } from "../types/patients.types"

interface PatientFormProps {
  onSubmit: (data: any) => void
  initialData?: Patient | null
}

export const PatientForm = ({ 
  onSubmit, 
  initialData, 
}: PatientFormProps) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: documentsData, isLoading: documentsLoading } = useTypeOfDocuments({ status: true })
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    document_type_id: null as number | null,
    document_number: "",
    phone: "",
    email: "",
    birth_date: "",
    company_id: null as number | null,
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const documents = documentsData?.results || []
  const companies = companiesData?.results || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        document_type_id: initialData.document_type_id || null,
        document_number: initialData.document_number || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        birth_date: initialData.birth_date ? initialData.birth_date.split('T')[0] : "",
        company_id: initialData.company_id || null,
        status: initialData.status !== undefined ? initialData.status : true
      })
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        document_type_id: null,
        document_number: "",
        phone: "",
        email: "",
        birth_date: "",
        company_id: isSuperAdmin ? null : currentCompanyId,
        status: true
      })
    }
  }, [initialData, isSuperAdmin, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "El nombre es requerido"
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "El apellido es requerido"
    }
    
    if (!formData.document_type_id) {
      newErrors.document_type_id = "El tipo de documento es requerido"
    }
    
    if (!formData.document_number.trim()) {
      newErrors.document_number = "El número de documento es requerido"
    } else if (formData.document_number.length < 8) {
      newErrors.document_number = "El número de documento debe tener al menos 8 caracteres"
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "El teléfono contiene caracteres no válidos"
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      document_type_id: formData.document_type_id,
      document_number: formData.document_number,
      phone: formData.phone,
      email: formData.email || null,
      birth_date: formData.birth_date || null,
      company_id: isSuperAdmin ? formData.company_id : currentCompanyId,
      status: formData.status
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (documentsLoading || companiesLoading) {
    return (
      <div className="patient-form__loading">
        <div className="patient-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form id="patient-form" className="patient-form" onSubmit={handleSubmit}>
      <div className="patient-form__section">
        <h4 className="patient-form__section-title">Información Personal</h4>
        
        <div className="patient-form__row">
          <div className="patient-form__field">
            <label className="patient-form__label">
              Nombre <span className="patient-form__required">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="Juan"
              className={`patient-form__input ${errors.first_name ? 'patient-form__input--error' : ''}`}
              value={formData.first_name}
              onChange={handleChange}
            />
            {errors.first_name && <span className="patient-form__error">{errors.first_name}</span>}
          </div>

          <div className="patient-form__field">
            <label className="patient-form__label">
              Apellido <span className="patient-form__required">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Pérez"
              className={`patient-form__input ${errors.last_name ? 'patient-form__input--error' : ''}`}
              value={formData.last_name}
              onChange={handleChange}
            />
            {errors.last_name && <span className="patient-form__error">{errors.last_name}</span>}
          </div>
        </div>

        <div className="patient-form__row">
          <div className="patient-form__field">
            <label className="patient-form__label">
              Tipo de Documento <span className="patient-form__required">*</span>
            </label>
            <select
              name="document_type_id"
              className={`patient-form__select ${errors.document_type_id ? 'patient-form__select--error' : ''}`}
              value={formData.document_type_id || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar tipo</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.abbreviation?.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.document_type_id && <span className="patient-form__error">{errors.document_type_id}</span>}
          </div>

          <div className="patient-form__field">
            <label className="patient-form__label">
              Número de Documento <span className="patient-form__required">*</span>
            </label>
            <input
              type="text"
              name="document_number"
              placeholder="12345678"
              className={`patient-form__input ${errors.document_number ? 'patient-form__input--error' : ''}`}
              value={formData.document_number}
              onChange={handleChange}
            />
            {errors.document_number && <span className="patient-form__error">{errors.document_number}</span>}
          </div>
        </div>

        <div className="patient-form__row">
          <div className="patient-form__field">
            <label className="patient-form__label">
              Teléfono <span className="patient-form__required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="987654321"
              className={`patient-form__input ${errors.phone ? 'patient-form__input--error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="patient-form__error">{errors.phone}</span>}
          </div>

          <div className="patient-form__field">
            <label className="patient-form__label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="juan@email.com"
              className={`patient-form__input ${errors.email ? 'patient-form__input--error' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="patient-form__error">{errors.email}</span>}
          </div>
        </div>

        <div className="patient-form__row">
          <div className="patient-form__field">
            <label className="patient-form__label">Fecha de Nacimiento</label>
            <input
              type="date"
              name="birth_date"
              className="patient-form__input"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>

          {isSuperAdmin && (
            <div className="patient-form__field">
              <label className="patient-form__label">
                Empresa
              </label>
              <select
                name="company_id"
                className="patient-form__select"
                value={formData.company_id || ''}
                onChange={handleChange}
              >
                <option value="">Seleccionar empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isSuperAdmin && currentCompanyId && (
            <input type="hidden" name="company_id" value={currentCompanyId} />
          )}
        </div>

        <div className="patient-form__field patient-form__field--checkbox">
          <label className="patient-form__checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Paciente activo</span>
          </label>
        </div>
      </div>
    </form>
  )
}
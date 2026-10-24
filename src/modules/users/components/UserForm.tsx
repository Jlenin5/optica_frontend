import { useState, useEffect } from "react"
import { useRoles } from "@roles/hooks/useRoles"
import { useCompanies } from "@companies/hooks/useCompanies"
import { useBranchOffices } from "@branch-offices/hooks/useBranchOffices"
// import { useEmployees } from "@/modules/human-resources/employees/hooks/useEmployees"
import { useAuthStore } from "@/app/store/auth.store"
import type { User } from "../types/users.types"
import MuiSvgIcon from '@/components/MuiSvgIcon'

interface UserFormProps {
  onSubmit: (data: any) => void
  initialData?: User | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const UserForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: UserFormProps) => {
  const { user: currentUser, currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    role_id: null as number | null,
    role_ids: [] as number[],
    company_id: null as number | null,
    branch_office_id: null as number | null,
    employee_id: null as number | null,
    password: "",
    confirmPassword: "",
    status: true,
    is_staff: false,
    is_superuser: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  const { data: rolesData, isLoading: rolesLoading } = useRoles({ limit: 100 })
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  const { data: branchOfficesData, isLoading: branchOfficesLoading } = useBranchOffices({ 
    company_id: formData.company_id || undefined,
    status: true 
  })
  // const { data: employeesData, isLoading: employeesLoading } = useEmployees({ 
  //   company_id: formData.company_id || undefined,
  //   status: true 
  // })

  const roles = rolesData?.results || []
  const companies = companiesData?.results || []
  const branchOffices = branchOfficesData?.pages.flatMap(page => page.results) || []
  // const employees = employeesData?.pages.flatMap(page => page.results) || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || "",
        username: initialData.username || "",
        role_id: initialData.role_id || initialData.role?.id || null,
        role_ids: initialData.roles?.map(role => role.id) || (initialData.role_id ? [initialData.role_id] : initialData.role?.id ? [initialData.role.id] : []),
        company_id: initialData.company_id || initialData.company?.id || null,
        branch_office_id: initialData.branch_office_id || null,
        employee_id: initialData.employee_id || null,
        password: "",
        confirmPassword: "",
        status: initialData.status !== undefined ? initialData.status : true,
        is_staff: initialData.is_staff || false,
        is_superuser: initialData.is_superuser || false
      })
    } else {
      setFormData({
        email: "",
        username: "",
        role_id: null,
        role_ids: [],
        company_id: isSuperAdmin ? null : currentCompanyId,
        branch_office_id: null,
        employee_id: null,
        password: "",
        confirmPassword: "",
        status: true,
        is_staff: false,
        is_superuser: false
      })
    }
  }, [initialData, isSuperAdmin, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }
    
    if (!formData.role_ids.length) {
      newErrors.role_id = "Debe asignar al menos un rol"
    }
    
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida"
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const { confirmPassword, ...submitData } = formData
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
    
    if (name === 'company_id') {
      setFormData(prev => ({
        ...prev,
        branch_office_id: null,
        employee_id: null
      }))
    }
  }

  if (rolesLoading || companiesLoading) {
    return (
      <div className="user-form__loading">
        <div className="user-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  // Obtener el nombre de la empresa actual de forma segura
  const currentCompanyName = currentUser?.company?.name || 'Mi Empresa'

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="user-form__section">
        <h4 className="user-form__section-title">Información de Acceso</h4>
        
        <div className="user-form__row">
          <div className="user-form__field">
            <label className="user-form__label">
              Email <span className="user-form__required">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@optica.com"
              className={`user-form__input ${errors.email ? 'user-form__input--error' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="user-form__error">{errors.email}</span>}
          </div>

          <div className="user-form__field">
            <label className="user-form__label">
              Nombre de Usuario <span className="user-form__required">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="usuario123"
              className={`user-form__input ${errors.username ? 'user-form__input--error' : ''}`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span className="user-form__error">{errors.username}</span>}
          </div>
        </div>

        <div className="user-form__row">
          <div className="user-form__field">
            <label className="user-form__label">
              Roles <span className="user-form__required">*</span>
            </label>
            <select
              multiple
              name="role_ids"
              className={`user-form__select user-form__select--multiple ${errors.role_id ? 'user-form__select--error' : ''}`}
              value={formData.role_ids.map(String)}
              onChange={(e) => {
                const role_ids = Array.from(e.target.selectedOptions).map(option => Number(option.value))
                setFormData(prev => ({ ...prev, role_ids, role_id: role_ids[0] ?? null }))
                if (errors.role_id) setErrors(prev => ({ ...prev, role_id: '' }))
              }}
              size={Math.min(6, Math.max(3, roles.length))}
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <small>Ctrl/Cmd + clic para seleccionar varios roles.</small>
            {errors.role_id && <span className="user-form__error">{errors.role_id}</span>}
          </div>

          {/* Selector de empresa - SOLO para super_admin */}
          {isSuperAdmin ? (
            <div className="user-form__field">
              <label className="user-form__label">
                Empresa <span className="user-form__required">*</span>
              </label>
              <select
                name="company_id"
                className={`user-form__select ${errors.company_id ? 'user-form__select--error' : ''}`}
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
              {errors.company_id && <span className="user-form__error">{errors.company_id}</span>}
            </div>
          ) : (
            // Empresa fija para usuarios NO super_admin (solo lectura)
            currentCompanyId && (
              <div className="user-form__field">
                <label className="user-form__label">
                  Empresa <span className="user-form__required">*</span>
                </label>
                <div className="user-form__static">
                  {currentCompanyName}
                </div>
                <input type="hidden" name="company_id" value={currentCompanyId} />
              </div>
            )
          )}
        </div>

        {/* Sucursal y Empleado - solo si hay empresa seleccionada */}
        {(formData.company_id || (!isSuperAdmin && currentCompanyId)) && (
          <div className="user-form__row">
            <div className="user-form__field">
              <label className="user-form__label">Sucursal</label>
              <select
                name="branch_office_id"
                className="user-form__select"
                value={formData.branch_office_id || ''}
                onChange={handleChange}
                disabled={branchOfficesLoading}
              >
                <option value="">Seleccionar sucursal</option>
                {branchOffices.map(office => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="user-form__field">
              <label className="user-form__label">Empleado</label>
              <select
                name="employee_id"
                className="user-form__select"
                value={formData.employee_id || ''}
                onChange={handleChange}
                disabled={employeesLoading}
              >
                <option value="">Seleccionar empleado</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="user-form__section">
          <h4 className="user-form__section-title">Contraseña</h4>
          
          <div className="user-form__row">
            <div className="user-form__field">
              <label className="user-form__label">
                Contraseña <span className="user-form__required">*</span>
              </label>
              <div className="user-form__password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••"
                  className={`user-form__input ${errors.password ? 'user-form__input--error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="user-form__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <MuiSvgIcon size={18}>
                    {showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                  </MuiSvgIcon>
                </button>
              </div>
              {errors.password && <span className="user-form__error">{errors.password}</span>}
            </div>

            <div className="user-form__field">
              <label className="user-form__label">
                Confirmar Contraseña <span className="user-form__required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                className={`user-form__input ${errors.confirmPassword ? 'user-form__input--error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="user-form__error">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>
      )}

      <div className="user-form__section">
        <h4 className="user-form__section-title">Permisos y Estado</h4>
        
        <div className="user-form__row">
          <div className="user-form__field user-form__field--checkbox">
            <label className="user-form__checkbox-label">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Usuario activo</span>
            </label>
          </div>

          {isSuperAdmin && (
            <>
              <div className="user-form__field user-form__field--checkbox">
                <label className="user-form__checkbox-label">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={formData.is_staff}
                    onChange={handleChange}
                    disabled={formData.is_superuser}
                  />
                  <span>Usuario staff</span>
                </label>
              </div>

              <div className="user-form__field user-form__field--checkbox">
                <label className="user-form__checkbox-label">
                  <input
                    type="checkbox"
                    name="is_superuser"
                    checked={formData.is_superuser}
                    onChange={handleChange}
                  />
                  <span>Super usuario</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  )
}
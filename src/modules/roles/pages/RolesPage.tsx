import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination } from "@/components/ui/module/ModulePagination"
import { useRoles } from "../hooks/useRoles"
import { RoleTable } from "../components/RoleTable"
import { RoleForm } from "../components/RoleForm"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useState } from "react"
import "@styles/roles.scss"
import "@styles/roles-rbac.scss"
import { useCreateRole } from "../hooks/useCreateRole"
import { useUpdateRole } from "../hooks/useUpdateRole"
import type { Role, RolePayload } from "../types/roles.types"
import { PermissionGate } from "@/components/auth/PermissionGate"

export const RolesPage = () => {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 350)
  const { data, isLoading, error, refetch } = useRoles({
    limit: pageSize,
    offset: page * pageSize,
    search: debouncedSearchTerm || undefined
  })
  
  const { mutate: createRole, isPending: isCreating } = useCreateRole()
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(true)

  const handleSubmit = (roleData: RolePayload) => {
    if (selectedRole) {
      updateRole(
        { id: selectedRole.id, data: roleData },
        {
          onSuccess: () => {
            setSelectedRole(null)
          }
        }
      )
    } else {
      createRole(roleData, {
        onSuccess: () => {
          // Opcional: limpiar formulario o mostrar mensaje
        }
      })
    }
  }

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setIsFormVisible(true)
  }

  const handleCancel = () => {
    setSelectedRole(null)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }


  const totalPages = data ? Math.ceil(data.count / pageSize) : 0

  if (error) {
    return (
      <div className="roles-page">
        <div className="roles-page__error">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>Error al cargar los roles</h3>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="roles-page">
      <div className="roles-page__header">
        <div className="roles-page__header-left">
          <h1 className="roles-page__title">Gestión de Roles</h1>
          <p className="roles-page__subtitle">
            Administra los roles y permisos del sistema
          </p>
        </div>
      </div>

      <div className={`roles-page__content`}>
        {/* Columna del formulario */}
        {isFormVisible && (
          <PermissionGate anyOf={["roles.create", "roles.update"]}>
          <div className="roles-page__form-column">
            <div className="roles-form-card">
              <div className="roles-form-card__header">
                <div className="roles-form-card__title-wrapper">
                  <h3 className="roles-form-card__title">
                    {selectedRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
                  </h3>
                </div>
              </div>
              <div className="roles-form-card__body">
                <RoleForm 
                  onSubmit={handleSubmit}
                  initialData={selectedRole}
                  onCancel={handleCancel}
                  isEditing={!!selectedRole}
                  // isLoading={isPending}
                />
              </div>
            </div>
          </div>
          </PermissionGate>
        )}

        {/* Columna de la tabla */}
        <div className="roles-page__table-column">
          <div className="roles-table-card">
            <div className="roles-table-card__header">
              <div className="roles-table-card__title-wrapper">
                <h3 className="roles-table-card__title">Lista de Roles</h3>
                <span className="roles-table-card__badge">
                  {data?.count || 0} total
                </span>
              </div>
              <div className="roles-table-card__toolbar">
                <div className="roles-table-card__search">
                  <MuiSvgIcon className="search-icon" size={20}>
                    lucide:search
                  </MuiSvgIcon>
                  <input
                    type="text"
                    placeholder="Buscar rol por nombre..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>
            </div>


            <div className="roles-table-card__content">
              {isLoading ? (
                <div className="roles-loading">
                  <div className="spinner"></div>
                  <p>Cargando roles...</p>
                </div>
              ) : (
                <>
                  <RoleTable 
                    data={data?.results || []}
                    onEdit={handleEdit}
                  />
                  
                  <ModulePagination
                    page={page}
                    pageCount={Math.max(1, totalPages)}
                    pageSize={pageSize}
                    total={data?.count || 0}
                    setPage={setPage}
                    setPageSize={(size) => { setPageSize(size); setPage(0) }}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
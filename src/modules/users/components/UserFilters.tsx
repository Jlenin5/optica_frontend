import MuiSvgIcon from '@components/MuiSvgIcon'
import { useRoles } from "@roles/hooks/useRoles"

interface UserFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  roleId: number | undefined
  onRoleIdChange: (roleId: number | undefined) => void
  onClearFilters: () => void
  totalResults?: number
}

export const UserFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleId,
  onRoleIdChange,
  onClearFilters,
  totalResults
}: UserFiltersProps) => {
  const { data: rolesData, isLoading: rolesLoading } = useRoles({ limit: 100 })
  const roles = rolesData?.results || []

  const hasActiveFilters = searchTerm || statusFilter !== undefined || roleId

  // Convertir boolean a string para el select
  const getStatusValue = () => {
    if (statusFilter === undefined) return 'all'
    return statusFilter ? 'active' : 'inactive'
  }

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onStatusFilterChange(undefined)
    } else if (value === 'active') {
      onStatusFilterChange(true)
    } else if (value === 'inactive') {
      onStatusFilterChange(false)
    }
  }

  return (
    <div className="user-filters">
      <div className="user-filters__left">
        <div className="user-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre, email o usuario..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {totalResults !== undefined && (
          <div className="user-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}

        <div className="user-filters__right">
          <select 
            className="user-filters__select"
            value={getStatusValue()}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <select 
            className="user-filters__select"
            value={roleId || ""}
            onChange={(e) => onRoleIdChange(e.target.value ? Number(e.target.value) : undefined)}
            disabled={rolesLoading}
          >
            <option value="">Todos los roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              className="user-filters__clear"
              onClick={onClearFilters}
              title="Limpiar filtros"
            >
              <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
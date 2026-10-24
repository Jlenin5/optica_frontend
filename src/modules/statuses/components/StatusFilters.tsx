import MuiSvgIcon from '@components/MuiSvgIcon'

interface StatusFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  isDefaultFilter: boolean | undefined
  onIsDefaultFilterChange: (isDefault: boolean | undefined) => void
  onClearFilters: () => void
  totalResults?: number
}

export const StatusFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isDefaultFilter,
  onIsDefaultFilterChange,
  onClearFilters,
  totalResults
}: StatusFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== undefined || isDefaultFilter !== undefined

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

  const getIsDefaultValue = () => {
    if (isDefaultFilter === undefined) return 'all'
    return isDefaultFilter ? 'default' : 'not-default'
  }

  const handleIsDefaultChange = (value: string) => {
    if (value === 'all') {
      onIsDefaultFilterChange(undefined)
    } else if (value === 'default') {
      onIsDefaultFilterChange(true)
    } else if (value === 'not-default') {
      onIsDefaultFilterChange(false)
    }
  }

  return (
    <div className="user-filters">
      <div className="user-filters__left">
        <div className="user-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
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
            value={getIsDefaultValue()}
            onChange={(e) => handleIsDefaultChange(e.target.value)}
          >
            <option value="all">Por defecto y no por defecto</option>
            <option value="default">Solo por defecto</option>
            <option value="not-default">Solo no por defecto</option>
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

import MuiSvgIcon from '@components/MuiSvgIcon'

interface BranchOfficeFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  onClearFilters: () => void
  totalResults?: number
}

export const BranchOfficeFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  totalResults
}: BranchOfficeFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== undefined

  return (
    <div className="branch-office-filters">
      <div className="branch-office-filters__left">
        <div className="branch-office-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o dirección..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="branch-office-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="branch-office-filters__right">
        <select 
          className="branch-office-filters__select"
          value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') onStatusFilterChange(undefined)
            else if (value === 'active') onStatusFilterChange(true)
            else onStatusFilterChange(false)
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </select>

        {hasActiveFilters && (
          <button
            className="branch-office-filters__clear"
            onClick={onClearFilters}
            title="Limpiar filtros"
          >
            <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
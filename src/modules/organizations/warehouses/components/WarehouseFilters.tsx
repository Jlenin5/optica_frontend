import MuiSvgIcon from '@components/MuiSvgIcon'

interface WarehouseFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  typeFilter: 'all' | 'company' | 'branch_office'
  onTypeFilterChange: (type: 'all' | 'company' | 'branch_office') => void
  onClearFilters: () => void
  totalResults?: number
}

export const WarehouseFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters,
  totalResults
}: WarehouseFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== undefined || typeFilter !== 'all'

  return (
    <div className="warehouse-filters">
      <div className="warehouse-filters__left">
        <div className="warehouse-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o dirección..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="warehouse-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="warehouse-filters__right">
        <select 
          className="warehouse-filters__select"
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value as 'all' | 'company' | 'branch_office')}
        >
          <option value="all">Todos los tipos</option>
          <option value="company">Almacenes de Empresa</option>
          <option value="branch_office">Almacenes de Sucursal</option>
        </select>

        <select 
          className="warehouse-filters__select"
          value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') onStatusFilterChange(undefined)
            else if (value === 'active') onStatusFilterChange(true)
            else onStatusFilterChange(false)
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        {hasActiveFilters && (
          <button
            className="warehouse-filters__clear"
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
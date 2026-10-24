import MuiSvgIcon from '@components/MuiSvgIcon'

interface BrandFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  visibleOnWebFilter: boolean | undefined
  onVisibleOnWebChange: (visible: boolean | undefined) => void
  onClearFilters: () => void
  totalResults?: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export const BrandFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  visibleOnWebFilter,
  onVisibleOnWebChange,
  onClearFilters,
  totalResults,
  viewMode,
  onViewModeChange
}: BrandFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== undefined || visibleOnWebFilter !== undefined

  return (
    <div className="brand-filters">
      <div className="brand-filters__left">
        <div className="brand-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="brand-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="brand-filters__right">
        <select 
          className="brand-filters__select"
          value={visibleOnWebFilter === undefined ? 'all' : visibleOnWebFilter ? 'visible' : 'hidden'}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') onVisibleOnWebChange(undefined)
            else if (value === 'visible') onVisibleOnWebChange(true)
            else onVisibleOnWebChange(false)
          }}
        >
          <option value="all">Todos (Web)</option>
          <option value="visible">Visibles en Web</option>
          <option value="hidden">Ocultas en Web</option>
        </select>

        <select 
          className="brand-filters__select"
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

        <div className="brand-filters__view-toggle">
          <button
            className={`brand-filters__view-btn ${viewMode === 'grid' ? 'brand-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Vista cuadrícula"
          >
            <MuiSvgIcon size={20}>lucide:layout-grid</MuiSvgIcon>
          </button>
          <button
            className={`brand-filters__view-btn ${viewMode === 'list' ? 'brand-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Vista lista"
          >
            <MuiSvgIcon size={20}>lucide:list</MuiSvgIcon>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            className="brand-filters__clear"
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
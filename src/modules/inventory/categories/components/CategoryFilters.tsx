import MuiSvgIcon from '@components/MuiSvgIcon'

interface CategoryFiltersProps {
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

export const CategoryFilters = ({
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
}: CategoryFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== undefined || visibleOnWebFilter !== undefined

  return (
    <div className="category-filters">
      <div className="category-filters__left">
        <div className="category-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="category-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="category-filters__right">
        <select 
          className="category-filters__select"
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
          className="category-filters__select"
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

        <div className="category-filters__view-toggle">
          <button
            className={`category-filters__view-btn ${viewMode === 'grid' ? 'category-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Vista cuadrícula"
          >
            <MuiSvgIcon size={20}>lucide:layout-grid</MuiSvgIcon>
          </button>
          <button
            className={`category-filters__view-btn ${viewMode === 'list' ? 'category-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Vista lista"
          >
            <MuiSvgIcon size={20}>lucide:list</MuiSvgIcon>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            className="category-filters__clear"
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
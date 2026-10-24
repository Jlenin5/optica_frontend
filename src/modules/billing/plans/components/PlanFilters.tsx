import MuiSvgIcon from '@components/MuiSvgIcon'

interface PlanFiltersProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
}

export const PlanFilters = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: PlanFiltersProps) => {
  return (
    <div className="plan-filters">
      <div className="plan-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="plan-filters__right">
        <select 
          className="plan-filters__select"
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

        <div className="plan-filters__view-toggle">
          <button
            className={`plan-filters__view-btn ${viewMode === 'grid' ? 'plan-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Vista cuadrícula"
          >
            <MuiSvgIcon size={20}>lucide:layout-grid</MuiSvgIcon>
          </button>
          <button
            className={`plan-filters__view-btn ${viewMode === 'list' ? 'plan-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Vista lista"
          >
            <MuiSvgIcon size={20}>lucide:list</MuiSvgIcon>
          </button>
        </div>
      </div>
    </div>
  )
}
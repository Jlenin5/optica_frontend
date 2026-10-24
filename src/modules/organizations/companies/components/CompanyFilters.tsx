import MuiSvgIcon from '@components/MuiSvgIcon'

interface CompanyFiltersProps {
  viewMode: 'table' | 'cards'
  onViewModeChange: (mode: 'table' | 'cards') => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: 'all' | 'active' | 'inactive'
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void
}

export const CompanyFilters = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: CompanyFiltersProps) => {
  return (
    <div className="company-filters">
      <div className="company-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por nombre, RUC o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="company-filters__right">
        <select 
          className="company-filters__select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as any)}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <div className="company-filters__view-toggle">
          <button
            className={`company-filters__view-btn ${viewMode === 'table' ? 'company-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Vista tabla"
          >
            <MuiSvgIcon size={20}>lucide:table</MuiSvgIcon>
          </button>
          <button
            className={`company-filters__view-btn ${viewMode === 'cards' ? 'company-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('cards')}
            title="Vista tarjetas"
          >
            <MuiSvgIcon size={20}>lucide:layout-grid</MuiSvgIcon>
          </button>
        </div>
      </div>
    </div>
  )
}
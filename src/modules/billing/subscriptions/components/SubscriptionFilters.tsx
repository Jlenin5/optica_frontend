import MuiSvgIcon from '@components/MuiSvgIcon'
import type { SubscriptionStatus } from '../types/subscriptions.types'

interface SubscriptionFiltersProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: SubscriptionStatus | undefined
  onStatusFilterChange: (status: SubscriptionStatus | undefined) => void
}

const statusOptions: { value: SubscriptionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activas' },
  { value: 'trial', label: 'Trial' },
  { value: 'past_due', label: 'Pendientes' },
  { value: 'canceled', label: 'Canceladas' }
]

export const SubscriptionFilters = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: SubscriptionFiltersProps) => {
  return (
    <div className="subscription-filters">
      <div className="subscription-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por empresa o plan..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="subscription-filters__right">
        <select 
          className="subscription-filters__select"
          value={statusFilter || 'all'}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') onStatusFilterChange(undefined)
            else onStatusFilterChange(value as SubscriptionStatus)
          }}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="subscription-filters__view-toggle">
          <button
            className={`subscription-filters__view-btn ${viewMode === 'grid' ? 'subscription-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Vista cuadrícula"
          >
            <MuiSvgIcon size={20}>lucide:layout-grid</MuiSvgIcon>
          </button>
          <button
            className={`subscription-filters__view-btn ${viewMode === 'list' ? 'subscription-filters__view-btn--active' : ''}`}
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
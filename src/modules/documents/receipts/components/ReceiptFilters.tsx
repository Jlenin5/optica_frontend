import MuiSvgIcon from '@components/MuiSvgIcon'

interface ReceiptFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  dateFrom: string
  onDateFromChange: (date: string) => void
  dateTo: string
  onDateToChange: (date: string) => void
  onClearFilters: () => void
}

export const ReceiptFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters
}: ReceiptFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== undefined || dateFrom || dateTo

  return (
    <div className="receipt-filters">
      <div className="receipt-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="receipt-filters__right">
        <select 
          className="receipt-filters__select"
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

        <div className="receipt-filters__date-range">
          <input
            type="date"
            className="receipt-filters__date"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
          <span className="receipt-filters__date-separator">-</span>
          <input
            type="date"
            className="receipt-filters__date"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            className="receipt-filters__clear"
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
import MuiSvgIcon from '@components/MuiSvgIcon'

interface TypeOfReceiptFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  receiptId: number | undefined
  onClearFilters: () => void
}

export const TypeOfReceiptFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  receiptId,
  onClearFilters
}: TypeOfReceiptFiltersProps) => {

  const hasActiveFilters = searchTerm || statusFilter !== undefined || receiptId

  return (
    <div className="type-of-receipt-filters">
      <div className="type-of-receipt-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por descripción o serie..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="type-of-receipt-filters__right">
        <select 
          className="type-of-receipt-filters__select"
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
            className="type-of-receipt-filters__clear"
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
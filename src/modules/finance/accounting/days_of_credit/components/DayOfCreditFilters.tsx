import MuiSvgIcon from '@components/MuiSvgIcon'

interface DayOfCreditFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const DayOfCreditFilters = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}: DayOfCreditFiltersProps) => {
  const hasActiveFilters = searchTerm !== ""

  return (
    <div className="day-of-credit-filters">
      <div className="day-of-credit-filters__left">
        <div className="day-of-credit-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por días de crédito..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="day-of-credit-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="day-of-credit-filters__right">
        {hasActiveFilters && (
          <button
            className="day-of-credit-filters__clear"
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
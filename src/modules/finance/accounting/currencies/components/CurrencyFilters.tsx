import MuiSvgIcon from '@components/MuiSvgIcon'

interface CurrencyFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const CurrencyFilters = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}: CurrencyFiltersProps) => {
  const hasActiveFilters = searchTerm !== ""

  return (
    <div className="currency-filters">
      <div className="currency-filters__left">
        <div className="currency-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre, código o símbolo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="currency-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="currency-filters__right">
        {hasActiveFilters && (
          <button
            className="currency-filters__clear"
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
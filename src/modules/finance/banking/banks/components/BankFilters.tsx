import MuiSvgIcon from '@components/MuiSvgIcon'

interface BankFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const BankFilters = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}: BankFiltersProps) => {
  const hasActiveFilters = searchTerm !== ""

  return (
    <div className="bank-filters">
      <div className="bank-filters__left">
        <div className="bank-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre o RUC..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="bank-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="bank-filters__right">
        {hasActiveFilters && (
          <button
            className="bank-filters__clear"
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
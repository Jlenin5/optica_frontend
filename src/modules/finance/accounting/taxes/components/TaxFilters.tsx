import MuiSvgIcon from '@components/MuiSvgIcon'

interface TaxFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const TaxFilters = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}: TaxFiltersProps) => {
  const hasActiveFilters = searchTerm !== ""

  return (
    <div className="tax-filters">
      <div className="tax-filters__left">
        <div className="tax-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="tax-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="tax-filters__right">
        {hasActiveFilters && (
          <button
            className="tax-filters__clear"
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
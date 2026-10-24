import MuiSvgIcon from '@components/MuiSvgIcon'

interface PaymentTypeFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const PaymentTypeFilters = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}: PaymentTypeFiltersProps) => {
  const hasActiveFilters = searchTerm !== ""

  return (
    <div className="payment-type-filters">
      <div className="payment-type-filters__left">
        <div className="payment-type-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="payment-type-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="payment-type-filters__right">
        {hasActiveFilters && (
          <button
            className="payment-type-filters__clear"
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
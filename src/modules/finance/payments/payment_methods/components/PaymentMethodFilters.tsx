import MuiSvgIcon from '@components/MuiSvgIcon'

interface PaymentMethodFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const PaymentMethodFilters = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}: PaymentMethodFiltersProps) => {
  const hasActiveFilters = searchTerm !== ""

  return (
    <div className="payment-method-filters">
      <div className="payment-method-filters__left">
        <div className="payment-method-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por descripción o código..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="payment-method-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="payment-method-filters__right">
        {hasActiveFilters && (
          <button
            className="payment-method-filters__clear"
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
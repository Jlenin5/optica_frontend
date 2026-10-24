import MuiSvgIcon from '@components/MuiSvgIcon'

interface ExchangeRateFiltersProps {
  dateFrom: string
  onDateFromChange: (date: string) => void
  dateTo: string
  onDateToChange: (date: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const ExchangeRateFilters = ({
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  totalResults
}: ExchangeRateFiltersProps) => {
  const hasActiveFilters = dateFrom !== "" || dateTo !== ""

  return (
    <div className="exchange-rate-filters">
      <div className="exchange-rate-filters__left">
        <div className="exchange-rate-filters__date-range">
          <input
            type="date"
            className="exchange-rate-filters__date"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
          <span className="exchange-rate-filters__date-separator">-</span>
          <input
            type="date"
            className="exchange-rate-filters__date"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="exchange-rate-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="exchange-rate-filters__right">
        {hasActiveFilters && (
          <button
            className="exchange-rate-filters__clear"
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
import { useCashRegisters } from "../hooks/useCashRegisters"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface CashRegisterSessionsFiltersProps {
  cashRegisterId: number | undefined
  onCashRegisterIdChange: (id: number | undefined) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  dateFrom: string
  onDateFromChange: (date: string) => void
  dateTo: string
  onDateToChange: (date: string) => void
  onClearFilters: () => void
  totalResults?: number
}

export const CashRegisterSessionsFilters = ({
  cashRegisterId,
  onCashRegisterIdChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  totalResults
}: CashRegisterSessionsFiltersProps) => {
  const { data: registersData } = useCashRegisters({
    status: true,
    // limit: 100
  })
  const registers = registersData?.pages.flatMap(page => page.results) || []

  const hasActiveFilters = cashRegisterId !== undefined || statusFilter !== "all" || dateFrom !== "" || dateTo !== ""

  return (
    <div className="cash-register-sessions-filters">
      <div className="cash-register-sessions-filters__left">
        <select 
          className="cash-register-sessions-filters__select"
          value={cashRegisterId || ""}
          onChange={(e) => onCashRegisterIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas las cajas</option>
          {registers.map(register => (
            <option key={register.id} value={register.id}>
              {register.name} {register.store?.name ? `(${register.store.name})` : ''}
            </option>
          ))}
        </select>

        <select 
          className="cash-register-sessions-filters__select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="open">Abiertas</option>
          <option value="closed">Cerradas</option>
        </select>

        <div className="cash-register-sessions-filters__date-range">
          <input
            type="date"
            className="cash-register-sessions-filters__date"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
          <span className="cash-register-sessions-filters__date-separator">-</span>
          <input
            type="date"
            className="cash-register-sessions-filters__date"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        {totalResults !== undefined && (
          <div className="cash-register-sessions-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="cash-register-sessions-filters__right">
        {hasActiveFilters && (
          <button
            className="cash-register-sessions-filters__clear"
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
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useCashRegisters } from "@/modules/finance/cash/cash_registers/hooks/useCashRegisters"
import { usePaymentMethods } from "@/modules/finance/payments/payment_methods/hooks/usePaymentMethods"

interface CashMovementFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  movementType: string
  onMovementTypeChange: (type: string) => void
  source: string
  onSourceChange: (source: string) => void
  cashRegisterId: number | undefined
  onCashRegisterIdChange: (id: number | undefined) => void
  paymentMethodId: number | undefined
  onPaymentMethodIdChange: (id: number | undefined) => void
  dateFrom: string
  onDateFromChange: (date: string) => void
  dateTo: string
  onDateToChange: (date: string) => void
  onClearFilters: () => void
  totalResults?: number
}

const MOVEMENT_TYPES = [
  { value: '', label: 'Todos' },
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Egresos' }
]

const SOURCES = [
  { value: '', label: 'Todas' },
  { value: 'sale', label: 'Venta' },
  { value: 'payment', label: 'Pago' },
  { value: 'manual', label: 'Manual' },
  { value: 'expense', label: 'Gasto' },
  { value: 'adjustment', label: 'Ajuste' }
]

export const CashMovementFilters = ({
  searchTerm,
  onSearchChange,
  movementType,
  onMovementTypeChange,
  source,
  onSourceChange,
  cashRegisterId,
  onCashRegisterIdChange,
  paymentMethodId,
  onPaymentMethodIdChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  totalResults
}: CashMovementFiltersProps) => {
  const { data: registersData } = useCashRegisters({ status: true })
  const { data: paymentMethodsData } = usePaymentMethods()
  
  const registers = registersData?.pages.flatMap(page => page.results) || []
  const paymentMethods = paymentMethodsData?.pages.flatMap(page => page.results) || []

  const hasActiveFilters = searchTerm !== "" || movementType !== "" || source !== "" || 
    cashRegisterId !== undefined || paymentMethodId !== undefined || dateFrom !== "" || dateTo !== ""

  return (
    <div className="cash-movement-filters">
      <div className="cash-movement-filters__left">
        <div className="cash-movement-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="cash-movement-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="cash-movement-filters__right">
        <select 
          className="cash-movement-filters__select"
          value={movementType}
          onChange={(e) => onMovementTypeChange(e.target.value)}
        >
          {MOVEMENT_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select 
          className="cash-movement-filters__select"
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
        >
          {SOURCES.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select 
          className="cash-movement-filters__select"
          value={cashRegisterId || ""}
          onChange={(e) => onCashRegisterIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas las cajas</option>
          {registers.map(register => (
            <option key={register.id} value={register.id}>
              {register.name}
            </option>
          ))}
        </select>

        <select 
          className="cash-movement-filters__select"
          value={paymentMethodId || ""}
          onChange={(e) => onPaymentMethodIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todos los métodos</option>
          {paymentMethods.map(method => (
            <option key={method.id} value={method.id}>
              {method.description}
            </option>
          ))}
        </select>

        <div className="cash-movement-filters__date-range">
          <input
            type="date"
            className="cash-movement-filters__date"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
          <span className="cash-movement-filters__date-separator">-</span>
          <input
            type="date"
            className="cash-movement-filters__date"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            className="cash-movement-filters__clear"
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
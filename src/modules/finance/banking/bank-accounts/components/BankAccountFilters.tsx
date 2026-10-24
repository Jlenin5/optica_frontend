import MuiSvgIcon from '@components/MuiSvgIcon'
import { useBanks } from "@/modules/finance/banking/banks/hooks/useBanks"
import { useCurrencies } from "@/modules/finance/accounting/currencies/hooks/useCurrencies"

interface BankAccountFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  bankId: number | undefined
  onBankIdChange: (id: number | undefined) => void
  currencyId: number | undefined
  onCurrencyIdChange: (id: number | undefined) => void
  onClearFilters: () => void
  totalResults?: number
}

export const BankAccountFilters = ({
  searchTerm,
  onSearchChange,
  bankId,
  onBankIdChange,
  currencyId,
  onCurrencyIdChange,
  onClearFilters,
  totalResults
}: BankAccountFiltersProps) => {
  const { data: banksData } = useBanks()
  const { data: currenciesData } = useCurrencies()
  
  const banks = banksData?.pages.flatMap(page => page.results) || []
  const currencies = currenciesData?.pages.flatMap(page => page.results) || []

  const hasActiveFilters = searchTerm !== "" || bankId !== undefined || currencyId !== undefined

  return (
    <div className="bank-account-filters">
      <div className="bank-account-filters__left">
        <div className="bank-account-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por banco, número de cuenta o descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="bank-account-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="bank-account-filters__right">
        <select 
          className="bank-account-filters__select"
          value={bankId || ""}
          onChange={(e) => onBankIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todos los bancos</option>
          {banks.map(bank => (
            <option key={bank.id} value={bank.id}>
              {bank.name}
            </option>
          ))}
        </select>

        <select 
          className="bank-account-filters__select"
          value={currencyId || ""}
          onChange={(e) => onCurrencyIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas las monedas</option>
          {currencies.map(currency => (
            <option key={currency.id} value={currency.id}>
              {currency.name} ({currency.code})
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            className="bank-account-filters__clear"
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
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useStores } from "@/modules/organizations/stores/hooks/useStores"

interface CashRegisterFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  storeId: number | undefined
  onStoreIdChange: (id: number | undefined) => void
  onClearFilters: () => void
  totalResults?: number
  showStatusFilter?: boolean
}

export const CashRegisterFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  storeId,
  onStoreIdChange,
  onClearFilters,
  totalResults,
  showStatusFilter = false
}: CashRegisterFiltersProps) => {
  const { data: storesData } = useStores()
  const stores = storesData?.pages.flatMap(page => page.results) || []

  const hasActiveFilters = searchTerm !== "" || statusFilter !== undefined || storeId !== undefined

  return (
    <div className="cash-register-filters">
      <div className="cash-register-filters__left">
        <div className="cash-register-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="cash-register-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="cash-register-filters__right">
        {showStatusFilter && (
          <select 
            className="cash-register-filters__select"
            value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value
              if (value === 'all') onStatusFilterChange(undefined)
              else if (value === 'active') onStatusFilterChange(true)
              else onStatusFilterChange(false)
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        )}

        <select 
          className="cash-register-filters__select"
          value={storeId || ""}
          onChange={(e) => onStoreIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas las tiendas</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            className="cash-register-filters__clear"
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
// AppointmentFilters.tsx
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useEffect, useState, type RefObject } from 'react'

interface AppointmentFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  dateFrom: string
  onDateFromChange: (date: string) => void
  dateTo: string
  onDateToChange: (date: string) => void
  onClearFilters: () => void
  totalResults?: number
  isSearching?: boolean
  inputRef?: RefObject<HTMLInputElement> // Recibir la ref
}

export const AppointmentFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  totalResults,
  isSearching = false,
  inputRef
}: AppointmentFiltersProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  
  // Sincronizar el término local cuando cambia el término padre
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const hasActiveFilters = searchTerm || statusFilter !== undefined || dateFrom || dateTo

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    onSearchChange(value)
  }

  return (
    <div className="appointment-filters">
      <div className="appointment-filters__left">
        <div className={`appointment-filters__search ${isSearching ? 'appointment-filters__search--loading' : ''}`}>
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por cliente, documento o notas..."
            value={localSearchTerm}
            onChange={handleSearchInputChange}
            autoComplete="off"
          />
          {isSearching && (
            <div className="appointment-filters__search-spinner">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        {totalResults !== undefined && (
          <div className="appointment-filters__results">
            <span>{totalResults} resultados</span>
            {isSearching && <span className="appointment-filters__searching-text">Buscando...</span>}
          </div>
        )}
      </div>

      <div className="appointment-filters__right">

        {/* Filtro por estado */}
        <select 
          className="appointment-filters__select"
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
          <option value="inactive">Canceladas</option>
        </select>

        {/* Rango de fechas */}
        <div className="appointment-filters__date-range">
          <input
            type="date"
            className="appointment-filters__date"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
          <span className="appointment-filters__date-separator">-</span>
          <input
            type="date"
            className="appointment-filters__date"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <button
            className="appointment-filters__clear"
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
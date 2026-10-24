import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { useState, useCallback, useRef } from "react"
import { useAppointments } from "../hooks/useAppointments"
import { AppointmentTable } from "../components/AppointmentTable"
import { AppointmentFilters } from "../components/AppointmentFilters"
import { AppointmentSkeleton } from "../components/AppointmentSkeleton"
import { useAuthStore } from "@/app/store/auth.store"
import "@styles/appointments.scss"

export const AppointmentsPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  
  // Referencia para mantener el foco
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { 
    data,
    isInitialLoading,
    isFetching,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    refetch 
  } = useAppointments({
    search: debouncedSearch || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    company_id: currentCompanyId || undefined
  })

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setDateFrom("")
    setDateTo("")
    
    // Restaurar foco después de limpiar filtros
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }, [])

  const allAppointments = data?.pages.flatMap(page => page.results) || []
  const totalAppointments = data?.pages[0]?.count || 0
  const { visibleData: paginatedAppointments, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allAppointments, total: totalAppointments, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  // Solo mostrar skeleton en la carga inicial
  if (isInitialLoading) {
    return <AppointmentSkeleton />
  }

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="appointments-page__header">
        <div className="appointments-page__header-left">
          <h1 className="appointments-page__title">
            Citas
          </h1>
        </div>
      </div>

      {/* Filters */}
      <AppointmentFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
        totalResults={totalAppointments}
        isSearching={isFetching && !isFetchingNextPage}
        inputRef={searchInputRef}
      />

      {/* Appointments Table */}
      <div className={`appointments-page__content ${isFetching ? 'appointments-page__content--loading' : ''}`}>
        {paginatedAppointments.length > 0 ? (
          <>
            <AppointmentTable 
              data={paginatedAppointments}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalAppointments}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="appointments-empty">
            <svg className="appointments-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay citas registradas</h3>
            <p>Comienza agendando una nueva cita</p>
          </div>
        )}
      </div>
    </div>
  )
}
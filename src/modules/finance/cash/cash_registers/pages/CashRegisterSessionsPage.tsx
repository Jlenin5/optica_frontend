import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useCashRegisterSessions } from "../hooks/useCashRegisterSessions"
import { useActiveSession } from "../hooks/useActiveSession"
import { CashRegisterSessionsTable } from "../components/CashRegisterSessionsTable"
import { CashRegisterSessionsFilters } from "../components/CashRegisterSessionsFilters"
import { CashRegisterSkeleton } from "../components/CashRegisterSkeleton"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/cash-registers.scss"
import { useAuthStore } from "@/app/store/auth.store"

export const CashRegisterSessionsPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [cashRegisterId, setCashRegisterId] = useState<number | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCashRegisterSessions({
    cash_register_id: cashRegisterId,
    status: statusFilter === 'all' ? undefined : statusFilter as any,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    user_id: user.id
  })
  
  const { data: activeSession, isLoading: sessionLoading } = useActiveSession()

  const handleClearFilters = useCallback(() => {
    setCashRegisterId(undefined)
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
  }, [])

  const allSessions = data?.pages.flatMap(page => page.results) || []
  const totalSessions = data?.pages[0]?.count || 0
  const { visibleData: paginatedSessions, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allSessions, total: totalSessions, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading || sessionLoading) {
    return <CashRegisterSkeleton />
  }

  return (
    <div className="cash-register-sessions-page">
      <div className="cash-register-sessions-page__header">
        <div className="cash-register-sessions-page__header-left">
          <button 
            className="cash-register-sessions-page__back-btn"
            onClick={() => navigate('/')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div>
            <h1 className="cash-register-sessions-page__title">
              Mis Sesiones de Caja
            </h1>
          </div>
        </div>
        {!activeSession && (
          <button 
            className="cash-register-sessions-page__open-btn"
            onClick={() => navigate('/cash-register/open')}
          >
            <MuiSvgIcon size={18}>
              lucide:plus
            </MuiSvgIcon>
            Agregar
          </button>
        )}
      </div>

      {activeSession && (
        <div className="cash-register-sessions-page__active">
          <div className="cash-register-sessions-page__active-card">
            <div className="cash-register-sessions-page__active-icon">
              <MuiSvgIcon size={24}>lucide:credit-card</MuiSvgIcon>
            </div>
            <div className="cash-register-sessions-page__active-info">
              <h3>Sesión Activa</h3>
              <p>
                Caja: <strong>{activeSession.cash_register?.name}</strong><br />
                Apertura: {new Date(activeSession.opened_at).toLocaleString()}<br />
                Monto inicial: S/ {Number(activeSession.opening_amount)?.toFixed(2)}
              </p>
            </div>
            <button
              className="cash-register-sessions-page__active-btn"
              onClick={() => navigate(`/cash-register/sessions/${activeSession.id}/close`)}
            >
              Cerrar Caja
            </button>
          </div>
        </div>
      )}

      <CashRegisterSessionsFilters
        cashRegisterId={cashRegisterId}
        onCashRegisterIdChange={setCashRegisterId}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
        totalResults={totalSessions}
      />

      <div className="cash-register-sessions-page__content">
        {paginatedSessions.length > 0 ? (
          <>
            <CashRegisterSessionsTable 
              data={paginatedSessions} 
              onRefresh={refetch}
              user={user}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalSessions}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="cash-register-sessions-empty">
            <svg className="cash-register-sessions-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay sesiones registradas</h3>
            <p>Comienza abriendo una nueva caja</p>
            <button 
              className="cash-register-sessions-empty__button"
              onClick={() => navigate('/cash-register/open')}
            >
              Abrir Caja
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { useState, useCallback } from "react"
import { useCashRegisters } from "../hooks/useCashRegisters"
import { useCashRegisterStats } from "../hooks/useCashRegisterStats"
import { useActiveSession } from "../hooks/useActiveSession"
import { CashRegistersTable } from "../components/CashRegistersTable"
import { CashRegisterFormModal } from "../components/CashRegisterFormModal"
import { CashRegisterFilters } from "../components/CashRegisterFilters"
import { CashRegisterStatsCards } from "../components/CashRegisterStatsCards"
import { CashRegisterSkeleton } from "../components/CashRegisterSkeleton"
import type { CashRegister } from "../types/cash-registers.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/cash-registers.scss"
import { useNavigate } from "react-router-dom"

export const CashRegistersManagementPage = () => {
  const navigate = useNavigate()
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const [storeId, setStoreId] = useState<number | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCashRegisters({
    search: debouncedSearch || undefined,
    status: statusFilter,
    store_id: storeId,
    company_id: !isSuperAdmin ? currentCompanyId || undefined : undefined
  })
  
  const { data: stats, isLoading: statsLoading } = useCashRegisterStats()
  const { data: activeSession, isLoading: sessionLoading } = useActiveSession()

  const hasActiveSession = !!activeSession

  const handleEdit = (register: CashRegister) => {
    setSelectedRegister(register)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedRegister(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRegister(null)
  }

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatusFilter(undefined)
    setStoreId(undefined)
  }, [])

  const allRegisters = data?.pages.flatMap(page => page.results) || []
  const totalRegisters = data?.pages[0]?.count || 0
  const { visibleData: paginatedRegisters, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allRegisters, total: totalRegisters, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if ((isLoading && !data) || statsLoading || sessionLoading) {
    return <CashRegisterSkeleton />
  }

  return (
    <div className="cash-registers-page">
      <div className="cash-registers-page__header">
        <div className="cash-registers-page__header-left">
          <h1 className="cash-registers-page__title">
            Configuración de Cajas
            {!isSuperAdmin && currentCompanyId && (
              <span className="cash-registers-page__company-badge">
                {user?.company?.name || 'Mi Empresa'}
              </span>
            )}
          </h1>
          <p className="cash-registers-page__subtitle">
            Gestiona las cajas disponibles para apertura
          </p>
        </div>
        <button 
          className="cash-registers-page__add-button" 
          onClick={handleAdd}
          disabled={hasActiveSession}
          title={hasActiveSession ? "Debes cerrar tu sesión activa antes de administrar cajas" : ""}
        >
          <svg className="cash-registers-page__add-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Nueva Caja
        </button>
      </div>

      {hasActiveSession && activeSession && (
        <div className="cash-registers-page__alert">
          <MuiSvgIcon size={20}>lucide:info</MuiSvgIcon>
          <span>
            Tienes una sesión de caja activa en <strong>{activeSession.cash_register?.name}</strong>. 
            Para administrar las cajas, debes cerrar tu sesión activa.
          </span>
          <button 
            className="cash-registers-page__alert-btn"
            onClick={() => navigate('/cash-register/sessions')}
          >
            Ver mis sesiones
          </button>
        </div>
      )}

      {stats && <CashRegisterStatsCards stats={stats} />}

      <CashRegisterFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        storeId={storeId}
        onStoreIdChange={setStoreId}
        onClearFilters={handleClearFilters}
        totalResults={totalRegisters}
        showStatusFilter={true}
      />

      <div className="cash-registers-page__content">
        {paginatedRegisters.length > 0 ? (
          <>
            <div className="cash-registers-page__table-header">
              <h3>Lista de Cajas</h3>
              <span className="cash-registers-page__count">{totalRegisters} cajas</span>
            </div>
            
            <CashRegistersTable 
              data={paginatedRegisters} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalRegisters}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="cash-registers-empty">
            <svg className="cash-registers-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay cajas registradas</h3>
            <p>Comienza creando una nueva caja</p>
            <button 
              className="cash-registers-empty__button" 
              onClick={handleAdd}
              disabled={hasActiveSession}
            >
              Crear Caja
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CashRegisterFormModal
          initialData={selectedRegister}
          onSubmit={() => {
            handleCloseModal()
            refetch()
          }}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  )
}
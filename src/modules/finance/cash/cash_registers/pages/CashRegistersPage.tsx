import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useCashRegisters } from "../hooks/useCashRegisters"
import { useActiveSession } from "../hooks/useActiveSession"
import { CashRegistersTable } from "../components/CashRegistersTable"
import { CashRegisterFormModal } from "../components/CashRegisterFormModal"
import { CashRegisterFilters } from "../components/CashRegisterFilters"
import { CashRegisterSkeleton } from "../components/CashRegisterSkeleton"
import type { CashRegister } from "../types/cash-registers.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/cash-registers.scss"
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning"

export const CashRegistersPage = () => {
  const navigate = useNavigate()
  const { user, getLimitValue, plan, currentCompanyId, isSuperAdmin: userIsSuperAdmin } = useAuthStore()

  const [maxCashregisters, setMaxCashregisters] = useState<number | null>(null)
  const [isLoadingLimits, setIsLoadingLimits] = useState(true)
  const [limitsLoaded, setLimitsLoaded] = useState(false)
  const limitsLoadAttempted = useRef(false)
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const [storeId, setStoreId] = useState<number | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(null)
  const [currentCashregistersCount, setCurrentCashregistersCount] = useState(0)
  const [showWarning, setShowWarning] = useState(true)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCashRegisters({
    search: debouncedSearch || undefined,
    status: statusFilter,
    store_id: storeId,
    company_id: !userIsSuperAdmin ? currentCompanyId || undefined : undefined
  })
  
  const { data: activeSession, isLoading: sessionLoading } = useActiveSession()

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return
      limitsLoadAttempted.current = true
      
      try {
        const limitValue = getLimitValue('max_cash_registers')
        setMaxCashregisters(limitValue !== undefined && limitValue !== null ? limitValue : null)
      } catch (error) {
        console.error('Error loading limits:', error)
        setMaxCashregisters(null)
      } finally {
        setIsLoadingLimits(false)
        setLimitsLoaded(true)
      }
    }
    
    loadLimits()
  }, [getLimitValue])

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  const canAddMoreCashregisters = useMemo(() => {
    if (isSuperAdmin) return true
    if (isLoadingLimits) return false
    return maxCashregisters === null || currentCashregistersCount < maxCashregisters
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, maxCashregisters, currentCashregistersCount])

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false
    if (isLoadingLimits || !limitsLoaded) return false
    if (!showWarning) return false
    if (maxCashregisters === null) return false
    if (currentCashregistersCount === 0) return false
    return currentCashregistersCount >= maxCashregisters - 1
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxCashregisters, currentCashregistersCount])

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0
    if (isLoadingLimits || !limitsLoaded) return 0
    if (!maxCashregisters || maxCashregisters === 0) return 0
    return (currentCashregistersCount / maxCashregisters) * 100
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentCashregistersCount, maxCashregisters])

  const allRegisters = data?.pages.flatMap(page => page.results) || []
  const totalRegisters = data?.pages[0]?.count || 0
  const { visibleData: paginatedRegisters, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allRegisters, total: totalRegisters, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count
      setCurrentCashregistersCount(newCount)
    }
  }, [data])

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

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  if ((isLoading && !data) || sessionLoading) {
    return <CashRegisterSkeleton />
  }

  return (
    <div className="cash-registers-page">
      {shouldShowWarning && maxCashregisters !== null && currentCashregistersCount > 0 && (
        <UserLimitWarning
          maxUsers={maxCashregisters}
          currentCount={currentCashregistersCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}
      
      {/* Header */}
      <div className="cash-registers-page__header">
        <div className="cash-registers-page__header-left">
          <h1 className="cash-registers-page__title">
            Configuración de Cajas
          </h1>
        </div>
        <button 
          className="add-button" 
          onClick={handleAdd}
          disabled={!canAddMoreCashregisters}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
          {!canAddMoreCashregisters && !isSuperAdmin && (
            <span className="cash-registers-page__add-badge">Límite alcanzado</span>
          )}
        </button>
      </div>

      {/* Active Session Alert */}
      {hasActiveSession && activeSession && (
        <div className="cash-registers-page__alert">
          <MuiSvgIcon size={20}>lucide:info</MuiSvgIcon>
          <span>
            Tienes una sesión de caja activa en <strong>{activeSession.cash_register?.name}</strong> desde {new Date(activeSession.opened_at).toLocaleString()}. 
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

      {/* Filters */}
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

      {/* Cash Registers Table */}
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
              isSuperAdmin={userIsSuperAdmin}
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
            <button className="cash-registers-empty__button" onClick={handleAdd}>
              Crear Caja
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear/editar caja */}
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
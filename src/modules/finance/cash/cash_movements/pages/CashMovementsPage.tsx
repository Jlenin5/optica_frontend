import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useCashMovements } from "../hooks/useCashMovements"
import { useCashMovementStats } from "../hooks/useCashMovementStats"
import { useActiveSession } from "@/modules/finance/cash/cash_registers/hooks/useActiveSession"
import { useCreateCashMovement } from "../hooks/useCreateCashMovement"
import { useUpdateCashMovement } from "../hooks/useUpdateCashMovement"
import { CashMovementTable } from "../components/CashMovementTable"
import { CashMovementForm } from "../components/CashMovementForm"
import { CashMovementFilters } from "../components/CashMovementFilters"
import { CashMovementStatsCards } from "../components/CashMovementStatsCards"
import { CashMovementSkeleton } from "../components/CashMovementSkeleton"
import type { CashMovement } from "../types/cash-movements.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/cash-movements.scss"

export const CashMovementsPage = () => {
  const { currentCompanyId } = useAuthStore()

  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [movementType, setMovementType] = useState("")
  const [source, setSource] = useState("")
  const [cashRegisterId, setCashRegisterId] = useState<number | undefined>(undefined)
  const [paymentMethodId, setPaymentMethodId] = useState<number | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<CashMovement | null>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCashMovements({
    search: debouncedSearch || undefined,
    movement_type: movementType as any || undefined,
    source: source as any || undefined,
    cash_register_id: cashRegisterId,
    payment_method_id: paymentMethodId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    company_id: currentCompanyId || undefined
  })
  
  const { data: activeSession, isLoading: sessionLoading } = useActiveSession()
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useCashMovementStats()
  
  const { mutate: createMovement, isPending: isCreating } = useCreateCashMovement()
  const { mutate: updateMovement, isPending: isUpdating } = useUpdateCashMovement()

  const handleSubmit = (data: any) => {
    if (selectedMovement) {
      updateMovement(
        { id: selectedMovement.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedMovement(null)
            refetch()
            refetchStats()
          }
        }
      )
    } else {
      createMovement(data, {
        onSuccess: () => {
          setIsModalOpen(false)
          refetch()
          refetchStats()
        }
      })
    }
  }

  const handleAdd = () => {
    if (!activeSession) {
      alert("Debes abrir una caja antes de registrar movimientos")
      navigate('/cash-register/open')
      return
    }
    setSelectedMovement(null)
    setIsModalOpen(true)
  }

  const handleEdit = (movement: CashMovement) => {
    setSelectedMovement(movement)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovement(null)
  }

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setMovementType("")
    setSource("")
    setCashRegisterId(undefined)
    setPaymentMethodId(undefined)
    setDateFrom("")
    setDateTo("")
  }, [])

  const allMovements = data?.pages.flatMap(page => page.results) || []
  const totalMovements = data?.pages[0]?.count || 0
  const { visibleData: paginatedMovements, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allMovements, total: totalMovements, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  // Mostrar skeleton mientras carga
  if ((isLoading && !data) || statsLoading || sessionLoading) {
    return <CashMovementSkeleton />
  }

  return (
    <div className="cash-movements-page">
      {/* Header */}
      <div className="cash-movements-page__header">
        <div className="cash-movements-page__header-left">
          <h1 className="cash-movements-page__title">
            Movimientos de Caja
          </h1>
        </div>
        <button 
          className="add-button" 
          onClick={handleAdd}
          disabled={isCreating}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Active Session Alert */}
      {!activeSession && (
        <div className="cash-movements-page__alert">
          <MuiSvgIcon size={20}>lucide:circle-alert</MuiSvgIcon>
          <span>No hay una caja activa. Debes abrir una caja antes de registrar movimientos.</span>
          <button 
            className="cash-movements-page__alert-btn"
            onClick={() => navigate('/cash-register/open')}
          >
            Abrir Caja
          </button>
        </div>
      )}

      {/* Stats Cards - Solo mostrar si stats existe */}
      {stats && <CashMovementStatsCards stats={stats} />}

      {/* Filters */}
      <CashMovementFilters
        searchTerm={search}
        onSearchChange={setSearch}
        movementType={movementType}
        onMovementTypeChange={setMovementType}
        source={source}
        onSourceChange={setSource}
        cashRegisterId={cashRegisterId}
        onCashRegisterIdChange={setCashRegisterId}
        paymentMethodId={paymentMethodId}
        onPaymentMethodIdChange={setPaymentMethodId}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
        totalResults={totalMovements}
      />

      {/* Cash Movements Table */}
      <div className="cash-movements-page__content">
        {paginatedMovements.length > 0 ? (
          <>
            <div className="cash-movements-page__table-header">
              <h3>Lista de Movimientos</h3>
              <span className="cash-movements-page__count">{totalMovements} movimientos</span>
            </div>
            
            <CashMovementTable 
              data={paginatedMovements} 
              onRefresh={() => {
                refetch()
                refetchStats()
              }}
              onEdit={handleEdit}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalMovements}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="cash-movements-empty">
            <svg className="cash-movements-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay movimientos registrados</h3>
            <p>Comienza registrando un nuevo movimiento de caja</p>
            <button 
              className="cash-movements-empty__button" 
              onClick={handleAdd}
              disabled={!activeSession || isCreating}
            >
              Registrar Movimiento
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedMovement ? 'Editar Movimiento' : 'Nuevo Movimiento'}
          onClose={handleCloseModal}
        >
              <CashMovementForm 
                onSubmit={handleSubmit}
                initialData={selectedMovement}
                onCancel={handleCloseModal}
                isEditing={!!selectedMovement}
                isSubmitting={isCreating || isUpdating}
                activeSession={activeSession}
              />
        </AppModal>
      )}
    </div>
  )
}

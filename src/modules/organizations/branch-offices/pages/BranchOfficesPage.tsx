import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useBranchOffices } from "../hooks/useBranchOffices"
import { useCreateBranchOffice } from "../hooks/useCreateBranchOffice"
import { useUpdateBranchOffice } from "../hooks/useUpdateBranchOffice"
import { BranchOfficeTable } from "../components/BranchOfficeTable"
import { BranchOfficeForm } from "../components/BranchOfficeForm"
import { BranchOfficeFilters } from "../components/BranchOfficeFilters"
import { BranchOfficeSkeleton } from "../components/BranchOfficeSkeleton"
import type { BranchOffice } from "../types/branch-offices.types"
import { useAuthStore } from "@/app/store/auth.store"
import "@styles/branch-offices.scss"
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning"
import MuiSvgIcon from '@components/MuiSvgIcon'

export const BranchOfficesPage = () => {
  const { user, getLimitValue, plan, isSuperAdmin: userIsSuperAdmin } = useAuthStore()
    
  const [maxBranchOffices, setMaxBranchOffices] = useState<number | null>(null)
  const [isLoadingLimits, setIsLoadingLimits] = useState(true)
  const [limitsLoaded, setLimitsLoaded] = useState(false)
  const limitsLoadAttempted = useRef(false)
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<BranchOffice | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentBranchOfficesCount, setCurrentBranchOfficesCount] = useState(0)
  const [showWarning, setShowWarning] = useState(true)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useBranchOffices({
    search: debouncedSearch || undefined,
    status
  })
  
  const { mutate: createBranchOffice, isPending: isCreating } = useCreateBranchOffice()
  const { mutate: updateBranchOffice, isPending: isUpdating } = useUpdateBranchOffice()

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return
      limitsLoadAttempted.current = true
      
      try {
        const limitValue = getLimitValue('max_branch_offices')
        setMaxBranchOffices(limitValue !== undefined && limitValue !== null ? limitValue : null)
      } catch (error) {
        console.error('Error loading limits:', error)
        setMaxBranchOffices(null)
      } finally {
        setIsLoadingLimits(false)
        setLimitsLoaded(true)
      }
    }
    
    loadLimits()
  }, [getLimitValue])

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  const canAddMoreBranchOffices = useMemo(() => {
    if (isSuperAdmin) return true
    if (isLoadingLimits) return false
    return maxBranchOffices === null || currentBranchOfficesCount < maxBranchOffices
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, maxBranchOffices, currentBranchOfficesCount])

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false
    if (isLoadingLimits || !limitsLoaded) return false
    if (!showWarning) return false
    if (maxBranchOffices === null) return false
    if (currentBranchOfficesCount === 0) return false
    return currentBranchOfficesCount >= maxBranchOffices - 1
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxBranchOffices, currentBranchOfficesCount])

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0
    if (isLoadingLimits || !limitsLoaded) return 0
    if (!maxBranchOffices || maxBranchOffices === 0) return 0
    return (currentBranchOfficesCount / maxBranchOffices) * 100
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentBranchOfficesCount, maxBranchOffices])

  const allBranchOffices = data?.pages.flatMap(page => page.results) || []
  const totalBranchOffices = data?.pages[0]?.count || 0
  const { visibleData: paginatedBranchOffices, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allBranchOffices, total: totalBranchOffices, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count
      setCurrentBranchOfficesCount(newCount)
    }
  }, [data])

  const handleSubmit = useCallback((branchOfficeData: Partial<BranchOffice>) => {
    if (selectedBranchOffice) {
      updateBranchOffice(
        { id: selectedBranchOffice.id, data: branchOfficeData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedBranchOffice(null)
          }
        }
      )
    } else {
      createBranchOffice(branchOfficeData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedBranchOffice, updateBranchOffice, createBranchOffice])

  const handleEdit = useCallback((branchOffice: BranchOffice) => {
    setSelectedBranchOffice(branchOffice)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedBranchOffice(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedBranchOffice(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
  }, [])

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  if (isLoading && !data) {
    return <BranchOfficeSkeleton />
  }

  return (
    <div className="branch-offices-page">
      {shouldShowWarning && maxBranchOffices !== null && currentBranchOfficesCount > 0 && (
        <UserLimitWarning
          maxUsers={maxBranchOffices}
          currentCount={currentBranchOfficesCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}
      
      {/* Header */}
      <div className="branch-offices-page__header">
        <div className="branch-offices-page__header-left">
          <h1 className="branch-offices-page__title">
            Sucursales
          </h1>
        </div>
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={!canAddMoreBranchOffices}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
          {!canAddMoreBranchOffices && !isSuperAdmin && (
            <span className="branch-offices-page__add-badge">Límite alcanzado</span>
          )}
        </button>
      </div>

      {/* Filters */}
      <BranchOfficeFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        onClearFilters={handleClearFilters}
        totalResults={totalBranchOffices}
      />

      {/* Branch Offices Table */}
      <div className="branch-offices-page__content">
        {paginatedBranchOffices.length > 0 ? (
          <>
            <BranchOfficeTable 
              data={paginatedBranchOffices} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalBranchOffices}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="branch-offices-empty">
            <svg className="branch-offices-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay sucursales registradas</h3>
            <p>Comienza creando una nueva sucursal para tu empresa</p>
            <button className="branch-offices-empty__button" onClick={handleAdd}>
              Crear Sucursal
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AppModal
          title={selectedBranchOffice ? 'Editar Sucursal' : 'Nueva Sucursal'}
          onClose={handleCloseModal}
        >
              <BranchOfficeForm 
                onSubmit={handleSubmit}
                initialData={selectedBranchOffice}
                onCancel={handleCloseModal}
                isEditing={!!selectedBranchOffice}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

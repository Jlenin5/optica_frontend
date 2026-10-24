import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback, useRef, useMemo, useEffect } from "react"
import { useWarehouses } from "../hooks/useWarehouses"
import { useCreateWarehouse } from "../hooks/useCreateWarehouse"
import { useUpdateWarehouse } from "../hooks/useUpdateWarehouse"
import { WarehouseTable } from "../components/WarehouseTable"
import { WarehouseForm } from "../components/WarehouseForm"
import { WarehouseFilters } from "../components/WarehouseFilters"
import { WarehouseSkeleton } from "../components/WarehouseSkeleton"
import type { Warehouse } from "../types/warehouses.types"
import { useAuthStore } from "@/app/store/auth.store"
import "@styles/warehouses.scss"
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning"
import MuiSvgIcon from '@components/MuiSvgIcon'

export const WarehousesPage = () => {
  const { user, getLimitValue, plan, currentCompanyId, isSuperAdmin: userIsSuperAdmin } = useAuthStore()
  
  const [maxWarehouses, setMaxWarehouses] = useState<number | null>(null)
  const [isLoadingLimits, setIsLoadingLimits] = useState(true)
  const [limitsLoaded, setLimitsLoaded] = useState(false)
  const limitsLoadAttempted = useRef(false)
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [type, setType] = useState<'all' | 'company' | 'branch_office'>('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentWarehousesCount, setCurrentWarehousesCount] = useState(0)
  const [showWarning, setShowWarning] = useState(true)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useWarehouses({
    search: debouncedSearch || undefined,
    status,
    type: type === 'all' ? undefined : type,
    company_id: currentCompanyId || undefined,
    branch_office_id: user?.branch_office_id || undefined,
  })
  
  const { mutate: createWarehouse, isPending: isCreating } = useCreateWarehouse()
  const { mutate: updateWarehouse, isPending: isUpdating } = useUpdateWarehouse()

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return
      limitsLoadAttempted.current = true
      
      try {
        const limitValue = getLimitValue('max_warehouses')
        setMaxWarehouses(limitValue !== undefined && limitValue !== null ? limitValue : null)
      } catch (error) {
        console.error('Error loading limits:', error)
        setMaxWarehouses(null)
      } finally {
        setIsLoadingLimits(false)
        setLimitsLoaded(true)
      }
    }
    
    loadLimits()
  }, [getLimitValue])

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  const canAddMoreWarehouses = useMemo(() => {
    if (isSuperAdmin) return true
    if (isLoadingLimits) return false
    return maxWarehouses === null || currentWarehousesCount < maxWarehouses
  }, [isSuperAdmin, isLoadingLimits, maxWarehouses, currentWarehousesCount])

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false
    if (isLoadingLimits || !limitsLoaded) return false
    if (!showWarning) return false
    if (maxWarehouses === null) return false
    if (currentWarehousesCount === 0) return false
    return currentWarehousesCount >= maxWarehouses - 1
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxWarehouses, currentWarehousesCount])

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0
    if (isLoadingLimits || !limitsLoaded) return 0
    if (!maxWarehouses || maxWarehouses === 0) return 0
    return (currentWarehousesCount / maxWarehouses) * 100
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentWarehousesCount, maxWarehouses])

  const allWarehouses = data?.pages.flatMap(page => page.results) || []
  const totalWarehouses = data?.pages[0]?.count || 0
  const { visibleData: paginatedWarehouses, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allWarehouses, total: totalWarehouses, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count
      setCurrentWarehousesCount(newCount)
    }
  }, [data])

  const handleSubmit = useCallback((warehouseData: Partial<Warehouse>) => {
    if (selectedWarehouse) {
      updateWarehouse(
        { id: selectedWarehouse.id, data: warehouseData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedWarehouse(null)
          }
        }
      )
    } else {
      createWarehouse(warehouseData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedWarehouse, updateWarehouse, createWarehouse])

  const handleEdit = useCallback((warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedWarehouse(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedWarehouse(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setType('all')
  }, [])

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  if (isLoading && !data) {
    return <WarehouseSkeleton />
  }

  return (
    <div className="warehouses-page">
      {shouldShowWarning && maxWarehouses !== null && currentWarehousesCount > 0 && (
        <UserLimitWarning
          maxUsers={maxWarehouses}
          currentCount={currentWarehousesCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}
      
      {/* Header */}
      <div className="warehouses-page__header">
        <div className="warehouses-page__header-left">
          <h1 className="warehouses-page__title">
            Almacenes
          </h1>
        </div>
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={!canAddMoreWarehouses}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
          {!canAddMoreWarehouses && !isSuperAdmin && (
            <span className="warehouses-page__add-badge">Límite alcanzado</span>
          )}
        </button>
      </div>

      {/* Filters */}
      <WarehouseFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        typeFilter={type}
        onTypeFilterChange={setType}
        onClearFilters={handleClearFilters}
        totalResults={totalWarehouses}
      />

      {/* Warehouses Table */}
      <div className="warehouses-page__content">
        {paginatedWarehouses.length > 0 ? (
          <>
            <WarehouseTable 
              data={paginatedWarehouses} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalWarehouses}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="warehouses-empty">
            <svg className="warehouses-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay almacenes registrados</h3>
            <p>Comienza creando un nuevo almacén para tu empresa</p>
            <button className="warehouses-empty__button" onClick={handleAdd}>
              Crear Almacén
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AppModal
          title={selectedWarehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
          onClose={handleCloseModal}
        >
              <WarehouseForm 
                onSubmit={handleSubmit}
                initialData={selectedWarehouse}
                onCancel={handleCloseModal}
                isEditing={!!selectedWarehouse}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

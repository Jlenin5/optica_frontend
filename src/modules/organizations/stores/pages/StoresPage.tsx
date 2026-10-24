import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useStores } from "../hooks/useStores"
import { useCreateStore } from "../hooks/useCreateStore"
import { useUpdateStore } from "../hooks/useUpdateStore"
import { StoreTable } from "../components/StoreTable"
import { StoreForm } from "../components/StoreForm"
import { StoreFilters } from "../components/StoreFilters"
import { StoreSkeleton } from "../components/StoreSkeleton"
import type { Store } from "../types/stores.types"
import { useAuthStore } from "@/app/store/auth.store"
import "@styles/stores.scss"
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning"
import MuiSvgIcon from '@components/MuiSvgIcon'

export const StoresPage = () => {
  const { user, getLimitValue, plan, currentCompanyId, isSuperAdmin: userIsSuperAdmin } = useAuthStore()
  
  const [maxStores, setMaxStores] = useState<number | null>(null)
  const [isLoadingLimits, setIsLoadingLimits] = useState(true)
  const [limitsLoaded, setLimitsLoaded] = useState(false)
  const limitsLoadAttempted = useRef(false)
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStoresCount, setCurrentStoresCount] = useState(0)
  const [showWarning, setShowWarning] = useState(true)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useStores({
    search: debouncedSearch || undefined,
    status,
    company_id: currentCompanyId || undefined,
  })
  
  const { mutate: createStore, isPending: isCreating } = useCreateStore()
  const { mutate: updateStore, isPending: isUpdating } = useUpdateStore()

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return
      limitsLoadAttempted.current = true
      
      try {
        const limitValue = getLimitValue('max_stores')
        setMaxStores(limitValue !== undefined && limitValue !== null ? limitValue : null)
      } catch (error) {
        console.error('Error loading limits:', error)
        setMaxStores(null)
      } finally {
        setIsLoadingLimits(false)
        setLimitsLoaded(true)
      }
    }
    
    loadLimits()
  }, [getLimitValue])

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  const canAddMoreStores = useMemo(() => {
    if (isSuperAdmin) return true
    if (isLoadingLimits) return false
    return maxStores === null || currentStoresCount < maxStores
  }, [isSuperAdmin, isLoadingLimits, maxStores, currentStoresCount])

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false
    if (isLoadingLimits || !limitsLoaded) return false
    if (!showWarning) return false
    if (maxStores === null) return false
    if (currentStoresCount === 0) return false
    return currentStoresCount >= maxStores - 1
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxStores, currentStoresCount])

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0
    if (isLoadingLimits || !limitsLoaded) return 0
    if (!maxStores || maxStores === 0) return 0
    return (currentStoresCount / maxStores) * 100
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentStoresCount, maxStores])

  const allStores = data?.pages.flatMap(page => page.results) || []
  const totalStores = data?.pages[0]?.count || 0
  const { visibleData: paginatedStores, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allStores, total: totalStores, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count
      setCurrentStoresCount(newCount)
    }
  }, [data])

  const handleSubmit = useCallback((storeData: Partial<Store>) => {
    if (selectedStore) {
      updateStore(
        { id: selectedStore.id, data: storeData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedStore(null)
          }
        }
      )
    } else {
      createStore(storeData as Store, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedStore, updateStore, createStore])

  const handleEdit = useCallback((store: Store) => {
    setSelectedStore(store)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedStore(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedStore(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
  }, [])

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  if (isLoading && !data) {
    return <StoreSkeleton />
  }

  return (
    <div className="stores-page">
      {shouldShowWarning && maxStores !== null && currentStoresCount > 0 && (
        <UserLimitWarning
          maxUsers={maxStores}
          currentCount={currentStoresCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}
      
      {/* Header */}
      <div className="stores-page__header">
        <div className="stores-page__header-left">
          <h1 className="stores-page__title">
            Tiendas
          </h1>
        </div>
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={!canAddMoreStores}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
          {!canAddMoreStores && !isSuperAdmin && (
            <span className="stores-page__add-badge">Límite alcanzado</span>
          )}
        </button>
      </div>

      {/* Filters */}
      <StoreFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        onClearFilters={handleClearFilters}
        totalResults={totalStores}
      />

      {/* Stores Table */}
      <div className="stores-page__content">
        {paginatedStores.length > 0 ? (
          <>
            <StoreTable 
              data={paginatedStores} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalStores}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="stores-empty">
            <svg className="stores-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay tiendas registradas</h3>
            <p>Comienza creando una nueva tienda para tu empresa</p>
            <button className="stores-empty__button" onClick={handleAdd}>
              Crear Tienda
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedStore ? 'Editar Tienda' : 'Nueva Tienda'}
          onClose={handleCloseModal}
        >
              <StoreForm 
                onSubmit={handleSubmit}
                initialData={selectedStore}
                onCancel={handleCloseModal}
                isEditing={!!selectedStore}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

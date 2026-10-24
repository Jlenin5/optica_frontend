import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useSubscriptions } from "../hooks/useSubscriptions"
import { useCreateSubscription } from "../hooks/useCreateSubscription"
import { SubscriptionCard } from "../components/SubscriptionCard"
import { SubscriptionForm } from "../components/SubscriptionForm"
import { SubscriptionFilters } from "../components/SubscriptionFilters"
import { SubscriptionSkeleton } from "../components/SubscriptionSkeleton"
import type { SubscriptionStatus } from "../types/subscriptions.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import "@styles/subscriptions.scss"

export const SubscriptionsPage = () => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<SubscriptionStatus | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('subscriptions-view-mode') as 'grid' | 'list') || 'grid'
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useSubscriptions({
    search: debouncedSearch || undefined,
    status
  })
  
  // const { data: stats, isLoading: statsLoading } = useSubscriptionStats()
  const { mutate: createSubscription, isPending: isCreating } = useCreateSubscription()

  const handleSubmit = (subscriptionData: any) => {
    createSubscription(subscriptionData, {
      onSuccess: () => {
        setIsModalOpen(false)
      }
    })
  }

  const handleAdd = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('subscriptions-view-mode', mode)
  }

  const allSubscriptions = data?.pages.flatMap(page => page.results) || []
  const totalSubscriptions = data?.pages[0]?.count || 0
  const { visibleData: paginatedSubscriptions, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allSubscriptions, total: totalSubscriptions, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-page__header">
        <div className="subscriptions-page__header-left">
          <h1 className="subscriptions-page__title">Suscripciones</h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <SubscriptionFilters
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
      />

      <div className="subscriptions-page__content">
        {isLoading ? (
          <div className={`subscriptions-${viewMode}`}>
            {[...Array(6)].map((_, i) => (
              <SubscriptionSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : paginatedSubscriptions.length > 0 ? (
          <>
            <div className={`subscriptions-${viewMode}`}>
              {paginatedSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onRefresh={refetch}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalSubscriptions}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="subscriptions-empty">
            <svg className="subscriptions-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay suscripciones registradas</h3>
            <p>Comienza creando una nueva suscripción para tus clientes</p>
            <button className="subscriptions-empty__button" onClick={handleAdd}>
              Nueva Suscripción
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title="Nueva Suscripción"
          onClose={handleCloseModal}
        >
              <SubscriptionForm 
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
                isSubmitting={isCreating}
              />
        </AppModal>
      )}
    </div>
  )
}

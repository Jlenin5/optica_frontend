import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { usePlans } from "../hooks/usePlans"
import { useCreatePlan } from "../hooks/useCreatePlan"
import { useUpdatePlan } from "../hooks/useUpdatePlan"
import { PlanCard } from "../components/PlanCard"
import { PlanForm } from "../components/PlanForm"
import { PlanFilters } from "../components/PlanFilters"
import { PlanSkeleton } from "../components/PlanSkeleton"
import type { Plan } from "../types/plans.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/plans.scss"

export const PlansPage = () => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('plans-view-mode') as 'grid' | 'list') || 'grid'
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = usePlans({
    search: debouncedSearch || undefined,
    status
  })
  
  // const { data: stats, isLoading: statsLoading } = usePlanStats()
  const { mutate: createPlan, isPending: isCreating } = useCreatePlan()
  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan()

  const handleSubmit = (planData: any) => {
    if (selectedPlan) {
      updatePlan(
        { id: selectedPlan.id, data: planData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedPlan(null)
          }
        }
      )
    } else {
      createPlan(planData, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedPlan(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPlan(null)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('plans-view-mode', mode)
  }

  const allPlans = data?.pages.flatMap(page => page.results) || []
  const totalPlans = data?.pages[0]?.count || 0
  const { visibleData: paginatedPlans, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allPlans, total: totalPlans, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  return (
    <div className="plans-page">
      <div className="plans-page__header">
        <div className="plans-page__header-left">
          <h1 className="plans-page__title">Planes</h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <PlanFilters
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
      />

      {/* Plans Grid/List */}
      <div className="plans-page__content">
        {isLoading ? (
          <div className={`plans-${viewMode}`}>
            {[...Array(6)].map((_, i) => (
              <PlanSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : paginatedPlans.length > 0 ? (
          <>
            <div className={`plans-${viewMode}`}>
              {paginatedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEdit}
                  onRefresh={refetch}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalPlans}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="plans-empty">
            <svg className="plans-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 12V8H4V12M20 12L4 12M20 12L20 16M4 12L4 16" stroke="currentColor" strokeWidth="2"/>
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay planes registrados</h3>
            <p>Comienza creando un nuevo plan de suscripción</p>
            <button className="plans-empty__button" onClick={handleAdd}>
              Crear Plan
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AppModal
          title={selectedPlan ? 'Editar Plan' : 'Nuevo Plan'}
          onClose={handleCloseModal}
        >
              <PlanForm 
                onSubmit={handleSubmit}
                initialData={selectedPlan}
                onCancel={handleCloseModal}
                isEditing={!!selectedPlan}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
// modules/limits/pages/LimitsPage.tsx
import { useState } from "react"
import { useLimits } from "../hooks/useLimits"
import { useCreateLimit } from "../hooks/useCreateLimit"
import { useUpdateLimit } from "../hooks/useUpdateLimit"
import { LimitTable } from "../components/LimitTable"
import { LimitForm } from "../components/LimitForm"
import { LimitFilters } from "../components/LimitFilters"
import { LimitSkeleton } from "../components/LimitSkeleton"
import type { Limit } from "../types/limits.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/limits.scss"

export const LimitsPage = () => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedLimit, setSelectedLimit] = useState<Limit | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useLimits({
    search: debouncedSearch || undefined
  })
  
  const { mutate: createLimit, isPending: isCreating } = useCreateLimit()
  const { mutate: updateLimit, isPending: isUpdating } = useUpdateLimit()

  const handleSubmit = (limitData: Partial<Limit>) => {
    if (selectedLimit) {
      updateLimit(
        { id: selectedLimit.id, data: limitData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedLimit(null)
          }
        }
      )
    } else {
      createLimit(limitData as Omit<Limit, 'id'>, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

  const handleEdit = (limit: Limit) => {
    setSelectedLimit(limit)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedLimit(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLimit(null)
  }

  const allLimits = data?.pages.flatMap(page => page.results) || []
  const totalLimits = data?.pages[0]?.count || 0
  const { visibleData: paginatedLimits, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allLimits, total: totalLimits, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  return (
    <div className="limits-page">
      <div className="limits-page__header">
        <div className="limits-page__header-left">
          <h1 className="limits-page__title">Límites del Sistema</h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <LimitFilters
        searchTerm={search}
        onSearchChange={setSearch}
      />

      <div className="limits-page__content">
        {isLoading ? (
          <LimitSkeleton />
        ) : paginatedLimits.length > 0 ? (
          <>
            <LimitTable 
              data={paginatedLimits} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalLimits}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="limits-empty">
            <svg className="limits-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay límites registrados</h3>
            <p>Comienza creando un nuevo límite para asignar a los planes</p>
            <button className="limits-empty__button" onClick={handleAdd}>
              Crear Límite
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedLimit ? 'Editar Límite' : 'Nuevo Límite'}
          onClose={handleCloseModal}
        >
              <LimitForm 
                onSubmit={handleSubmit}
                initialData={selectedLimit}
                onCancel={handleCloseModal}
                isEditing={!!selectedLimit}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

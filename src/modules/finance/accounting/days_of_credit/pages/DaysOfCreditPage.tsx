import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useDaysOfCredit } from "../hooks/useDaysOfCredit"
import { useCreateDayOfCredit } from "../hooks/useCreateDayOfCredit"
import { useUpdateDayOfCredit } from "../hooks/useUpdateDayOfCredit"
import { DayOfCreditTable } from "../components/DayOfCreditTable"
import { DayOfCreditForm } from "../components/DayOfCreditForm"
import { DayOfCreditFilters } from "../components/DayOfCreditFilters"
import { DayOfCreditSkeleton } from "../components/DayOfCreditSkeleton"
import type { DayOfCredit } from "../types/days-of-credit.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/days-of-credit.scss"
import { Button } from '@/components/ui/Button'

export const DaysOfCreditPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedDayOfCredit, setSelectedDayOfCredit] = useState<DayOfCredit | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useDaysOfCredit({
    search: debouncedSearch || undefined,
    company_id: currentCompanyId || undefined
  })
  
  const { mutate: createDayOfCredit, isPending: isCreating } = useCreateDayOfCredit()
  const { mutate: updateDayOfCredit, isPending: isUpdating } = useUpdateDayOfCredit()

  const handleSubmit = useCallback((dayOfCreditData: Partial<DayOfCredit>) => {
    if (selectedDayOfCredit) {
      updateDayOfCredit(
        { id: selectedDayOfCredit.id, data: dayOfCreditData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedDayOfCredit(null)
          }
        }
      )
    } else {
      createDayOfCredit(dayOfCreditData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedDayOfCredit, updateDayOfCredit, createDayOfCredit])

  const handleEdit = useCallback((dayOfCredit: DayOfCredit) => {
    setSelectedDayOfCredit(dayOfCredit)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedDayOfCredit(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedDayOfCredit(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
  }, [])

  const allDaysOfCredit = data?.pages.flatMap(page => page.results) || []
  const totalDaysOfCredit = data?.pages[0]?.count || 0
  const { visibleData: paginatedDaysOfCredit, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allDaysOfCredit, total: totalDaysOfCredit, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <DayOfCreditSkeleton />
  }

  return (
    <div className="days-of-credit-page">
      <div className="days-of-credit-page__header">
        <div className="days-of-credit-page__header-left">
          <h1 className="days-of-credit-page__title">
            Días de Crédito
          </h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <DayOfCreditFilters
        searchTerm={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        totalResults={totalDaysOfCredit}
      />

      <div className="days-of-credit-page__content">
        {paginatedDaysOfCredit.length > 0 ? (
          <>
            <DayOfCreditTable 
              data={paginatedDaysOfCredit} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalDaysOfCredit}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="days-of-credit-empty">
            <svg className="days-of-credit-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay días de crédito registrados</h3>
            <p>Comienza creando un nuevo día de crédito en el sistema</p>
            <button className="days-of-credit-empty__button" onClick={handleAdd}>
              Crear Día de Crédito
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AppModal
          title={selectedDayOfCredit ? 'Editar Día de Crédito' : 'Nuevo Día de Crédito'}
          onClose={handleCloseModal}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" form="customer-form" isLoading={isCreating || isUpdating}>
                Guardar
              </Button>
            </>
          }
        >
          <DayOfCreditForm 
            onSubmit={handleSubmit}
            initialData={selectedDayOfCredit}
            onCancel={handleCloseModal}
            isEditing={!!selectedDayOfCredit}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}

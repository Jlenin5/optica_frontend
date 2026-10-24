import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useStatuses } from "../hooks/useStatuses"
import { useCreateStatus } from "../hooks/useCreateStatus"
import { useUpdateStatus } from "../hooks/useUpdateStatus"
import { StatusTable } from "../components/StatusTable"
import { StatusForm } from "../components/StatusForm"
import { StatusFilters } from "../components/StatusFilters"
import { StatusSkeleton } from "../components/StatusSkeleton"
import type { CreateStatusDTO, Status } from "../types/statuses.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/statuses.scss"
import { Button } from '@/components/ui/Button'

export const StatusesPage = () => {
  const { user, isSuperAdmin: userIsSuperAdmin } = useAuthStore()

  // Estado del componente
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [isDefaultFilter, setIsDefaultFilter] = useState<boolean | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Consultas y mutaciones
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useStatuses({
    search: debouncedSearch || undefined,
    status,
    is_default: isDefaultFilter,
  })

  const { mutate: createStatus, isPending: isCreating } = useCreateStatus()
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStatus()

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  // Obtener datos de la API
  const allStatuses = data?.pages.flatMap(page => page.results) || []
  const totalStatuses = data?.pages[0]?.count || 0
  const { visibleData: paginatedStatuses, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allStatuses, total: totalStatuses, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  // Handlers
  const handleSubmit = useCallback((statusData: CreateStatusDTO) => {
    if (selectedStatus) {
      updateStatus(
        { id: selectedStatus.id, data: statusData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedStatus(null)
          }
        }
      )
    } else {
      createStatus(statusData, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedStatus, updateStatus, createStatus])

  const handleEdit = useCallback((status: Status) => {
    setSelectedStatus(status)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedStatus(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedStatus(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setIsDefaultFilter(undefined)
  }, [])

  // Renderizado condicional
  if (isLoading && !data) {
    return <StatusSkeleton />
  }

  return (
    <div className="statuses-page">
      {/* Header */}
      <div className="statuses-page__header">
        <div className="statuses-page__header-left">
          <h1 className="statuses-page__title">
            Estados Comerciales
          </h1>
        </div>
        <button
          className="add-button"
          onClick={handleAdd}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <StatusFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        isDefaultFilter={isDefaultFilter}
        onIsDefaultFilterChange={setIsDefaultFilter}
        onClearFilters={handleClearFilters}
        totalResults={totalStatuses}
      />

      {/* Statuses Table */}
      <div className="statuses-page__content">
        {paginatedStatuses.length > 0 ? (
          <>
            <StatusTable
              data={paginatedStatuses}
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />

            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalStatuses}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="statuses-empty">
            <h3>No hay estados registrados</h3>
            <p>Comienza creando un nuevo estado en el sistema</p>
            <button
              className="statuses-empty__button"
              onClick={handleAdd}
            >
              Crear Estado
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedStatus ? 'Editar Estado' : 'Nuevo Estado'}
          onClose={handleCloseModal}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" form="patient-form" isLoading={isCreating || isUpdating}>
                Guardar
              </Button>
            </>
          }
        >
          <StatusForm
            onSubmit={handleSubmit}
            initialData={selectedStatus}
            onCancel={handleCloseModal}
            isEditing={!!selectedStatus}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}

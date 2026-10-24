import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useTypeOfReceipts } from "../hooks/useTypeOfReceipts"
import { useCreateTypeOfReceipt } from "../hooks/useCreateTypeOfReceipt"
import { useUpdateTypeOfReceipt } from "../hooks/useUpdateTypeOfReceipt"
import { TypeOfReceiptTable } from "../components/TypeOfReceiptTable"
import { TypeOfReceiptForm } from "../components/TypeOfReceiptForm"
import { TypeOfReceiptFilters } from "../components/TypeOfReceiptFilters"
import { TypeOfReceiptSkeleton } from "../components/TypeOfReceiptSkeleton"
import type { TypeOfReceipt } from "../types/type-of-receipts.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/type-of-receipts.scss"

export const TypeOfReceiptsPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [receiptId, setReceiptId] = useState<number | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [selectedTypeOfReceipt, setSelectedTypeOfReceipt] = useState<TypeOfReceipt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useTypeOfReceipts({
    search: debouncedSearch || undefined,
    status,
    receipt_id: receiptId,
    company_id: currentCompanyId || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined
  })
  
  const { mutate: createTypeOfReceipt, isPending: isCreating } = useCreateTypeOfReceipt()
  const { mutate: updateTypeOfReceipt, isPending: isUpdating } = useUpdateTypeOfReceipt()

  const handleSubmit = (typeOfReceiptData: Partial<TypeOfReceipt>) => {
    if (selectedTypeOfReceipt) {
      updateTypeOfReceipt(
        { id: selectedTypeOfReceipt.id, data: typeOfReceiptData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedTypeOfReceipt(null)
          }
        }
      )
    } else {
      createTypeOfReceipt(typeOfReceiptData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

  const handleEdit = (typeOfReceipt: TypeOfReceipt) => {
    setSelectedTypeOfReceipt(typeOfReceipt)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedTypeOfReceipt(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTypeOfReceipt(null)
  }

  const allTypeOfReceipts = data?.pages.flatMap(page => page.results) || []
  const totalTypeOfReceipts = data?.pages[0]?.count || 0
  const { visibleData: paginatedTypeOfReceipts, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allTypeOfReceipts, total: totalTypeOfReceipts, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  const handleClearFilters = () => {
    setSearch("")
    setStatus(undefined)
    setReceiptId(undefined)
    setDateFrom("")
    setDateTo("")
  }

  return (
    <div className="type-of-receipts-page">
      <div className="type-of-receipts-page__header">
        <div className="type-of-receipts-page__header-left">
          <h1 className="type-of-receipts-page__title">Tipos de Recibo</h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <TypeOfReceiptFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        receiptId={receiptId}
        onClearFilters={handleClearFilters}
      />

      <div className="type-of-receipts-page__content">
        {isLoading ? (
          <TypeOfReceiptSkeleton />
        ) : paginatedTypeOfReceipts.length > 0 ? (
          <>
            <TypeOfReceiptTable 
              data={paginatedTypeOfReceipts} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalTypeOfReceipts}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="type-of-receipts-empty">
            <svg className="type-of-receipts-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay tipos de recibo registrados</h3>
            <p>Comienza creando un nuevo tipo de recibo para el sistema</p>
            <button className="type-of-receipts-empty__button" onClick={handleAdd}>
              Crear Tipo de Recibo
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AppModal
          title={selectedTypeOfReceipt ? 'Editar Tipo de Recibo' : 'Nuevo Tipo de Recibo'}
          onClose={handleCloseModal}
        >
              <TypeOfReceiptForm
                onSubmit={handleSubmit}
                initialData={selectedTypeOfReceipt}
                onCancel={handleCloseModal}
                isEditing={!!selectedTypeOfReceipt}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

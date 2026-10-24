import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useReceipts } from "../hooks/useReceipts"
import { useCreateReceipt } from "../hooks/useCreateReceipt"
import { useUpdateReceipt } from "../hooks/useUpdateReceipt"
import { ReceiptTable } from "../components/ReceiptTable"
import { ReceiptForm } from "../components/ReceiptForm"
import { ReceiptFilters } from "../components/ReceiptFilters"
import { ReceiptSkeleton } from "../components/ReceiptSkeleton"
import type { Receipt, UpdateReceiptDTO } from "../types/receipts.types"
import "@styles/receipts.scss"

export const ReceiptsPage = () => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useReceipts({
    search: debouncedSearch || undefined,
    status,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined
  })
  
  const { mutate: createReceipt, isPending: isCreating } = useCreateReceipt()
  const { mutate: updateReceipt, isPending: isUpdating } = useUpdateReceipt()

  const handleSubmit = (receiptData: UpdateReceiptDTO) => {
    if (selectedReceipt) {
      updateReceipt(
        { id: selectedReceipt.id, data: receiptData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedReceipt(null)
          }
        }
      )
    } else {
      createReceipt(receiptData as Receipt, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

  const handleEdit = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedReceipt(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReceipt(null)
  }

  const allReceipts = data?.pages.flatMap(page => page.results) || []
  const totalReceipts = data?.pages[0]?.count || 0
  const { visibleData: paginatedReceipts, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allReceipts, total: totalReceipts, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  const handleClearFilters = () => {
    setSearch("")
    setStatus(undefined)
    setDateFrom("")
    setDateTo("")
  }

  return (
    <div className="receipts-page">
      {/* Header */}
      <div className="receipts-page__header">
        <div className="receipts-page__header-left">
          <h1 className="receipts-page__title">Recibos</h1>
          <p className="receipts-page__subtitle">
            Gestiona los recibos y comprobantes del sistema
          </p>
        </div>
        <button className="receipts-page__add-button" onClick={handleAdd}>
          <svg className="receipts-page__add-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <ReceiptFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
      />

      {/* Receipts Table */}
      <div className="receipts-page__content">
        {isLoading ? (
          <ReceiptSkeleton />
        ) : paginatedReceipts.length > 0 ? (
          <>
            <ReceiptTable 
              data={paginatedReceipts} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalReceipts}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="receipts-empty">
            <svg className="receipts-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay recibos registrados</h3>
            <p>Comienza creando un nuevo recibo para el sistema</p>
            <button className="receipts-empty__button" onClick={handleAdd}>
              Crear Recibo
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedReceipt ? 'Editar Recibo' : 'Nuevo Recibo'}
          onClose={handleCloseModal}
        >
              <ReceiptForm 
                onSubmit={handleSubmit}
                initialData={selectedReceipt}
                onCancel={handleCloseModal}
                isEditing={!!selectedReceipt}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

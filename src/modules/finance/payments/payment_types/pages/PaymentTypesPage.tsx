import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { usePaymentTypes } from "../hooks/usePaymentTypes"
import { useCreatePaymentType } from "../hooks/useCreatePaymentType"
import { useUpdatePaymentType } from "../hooks/useUpdatePaymentType"
import { PaymentTypeTable } from "../components/PaymentTypeTable"
import { PaymentTypeForm } from "../components/PaymentTypeForm"
import { PaymentTypeFilters } from "../components/PaymentTypeFilters"
import { PaymentTypeSkeleton } from "../components/PaymentTypeSkeleton"
import type { PaymentType } from "../types/payment-types.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/payment-types.scss"

export const PaymentTypesPage = () => {  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = usePaymentTypes({
    search: debouncedSearch || undefined
  })
  
  const { mutate: createPaymentType, isPending: isCreating } = useCreatePaymentType()
  const { mutate: updatePaymentType, isPending: isUpdating } = useUpdatePaymentType()

  const handleSubmit = useCallback((paymentTypeData: Partial<PaymentType>) => {
    if (selectedPaymentType) {
      updatePaymentType(
        { id: selectedPaymentType.id, data: paymentTypeData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedPaymentType(null)
          }
        }
      )
    } else {
      createPaymentType(paymentTypeData as PaymentType, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedPaymentType, updatePaymentType, createPaymentType])

  const handleEdit = useCallback((paymentType: PaymentType) => {
    setSelectedPaymentType(paymentType)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedPaymentType(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPaymentType(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
  }, [])

  const allPaymentTypes = data?.pages.flatMap(page => page.results) || []
  const totalPaymentTypes = data?.pages[0]?.count || 0
  const { visibleData: paginatedPaymentTypes, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allPaymentTypes, total: totalPaymentTypes, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <PaymentTypeSkeleton />
  }

  return (
    <div className="payment-types-page">
      {/* Header */}
      <div className="payment-types-page__header">
        <div className="payment-types-page__header-left">
          <h1 className="payment-types-page__title">
            Tipos de Pago
          </h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <PaymentTypeFilters
        searchTerm={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        totalResults={totalPaymentTypes}
      />

      {/* Payment Types Table */}
      <div className="payment-types-page__content">
        {paginatedPaymentTypes.length > 0 ? (
          <>
            <PaymentTypeTable 
              data={paginatedPaymentTypes} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalPaymentTypes}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="payment-types-empty">
            <svg className="payment-types-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay tipos de pago registrados</h3>
            <p>Comienza creando un nuevo tipo de pago en el sistema</p>
            <button className="payment-types-empty__button" onClick={handleAdd}>
              Crear Tipo de Pago
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedPaymentType ? 'Editar Tipo de Pago' : 'Nuevo Tipo de Pago'}
          onClose={handleCloseModal}
        >
              <PaymentTypeForm
                onSubmit={handleSubmit}
                initialData={selectedPaymentType}
                onCancel={handleCloseModal}
                isEditing={!!selectedPaymentType}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

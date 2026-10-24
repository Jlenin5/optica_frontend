import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { usePaymentMethods } from "../hooks/usePaymentMethods"
import { useCreatePaymentMethod } from "../hooks/useCreatePaymentMethod"
import { useUpdatePaymentMethod } from "../hooks/useUpdatePaymentMethod"
import { PaymentMethodTable } from "../components/PaymentMethodTable"
import { PaymentMethodForm } from "../components/PaymentMethodForm"
import { PaymentMethodFilters } from "../components/PaymentMethodFilters"
import { PaymentMethodSkeleton } from "../components/PaymentMethodSkeleton"
import type { PaymentMethod } from "../types/payment-methods.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/payment-methods.scss"

export const PaymentMethodsPage = () => {  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = usePaymentMethods({
    search: debouncedSearch || undefined
  })
  
  const { mutate: createPaymentMethod, isPending: isCreating } = useCreatePaymentMethod()
  const { mutate: updatePaymentMethod, isPending: isUpdating } = useUpdatePaymentMethod()

  const handleSubmit = useCallback((paymentMethodData: Partial<PaymentMethod>) => {
    if (selectedPaymentMethod) {
      updatePaymentMethod(
        { id: selectedPaymentMethod.id, data: paymentMethodData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedPaymentMethod(null)
          }
        }
      )
    } else {
      createPaymentMethod(paymentMethodData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedPaymentMethod, updatePaymentMethod, createPaymentMethod])

  const handleEdit = useCallback((paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedPaymentMethod(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPaymentMethod(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
  }, [])

  const allPaymentMethods = data?.pages.flatMap(page => page.results) || []
  const totalPaymentMethods = data?.pages[0]?.count || 0
  const { visibleData: paginatedPaymentMethods, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allPaymentMethods, total: totalPaymentMethods, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <PaymentMethodSkeleton />
  }

  return (
    <div className="payment-methods-page">
      {/* Header */}
      <div className="payment-methods-page__header">
        <div className="payment-methods-page__header-left">
          <h1 className="payment-methods-page__title">
            Métodos de Pago
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
      <PaymentMethodFilters
        searchTerm={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        totalResults={totalPaymentMethods}
      />

      {/* Payment Methods Table */}
      <div className="payment-methods-page__content">
        {paginatedPaymentMethods.length > 0 ? (
          <>
            <PaymentMethodTable 
              data={paginatedPaymentMethods} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalPaymentMethods}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="payment-methods-empty">
            <svg className="payment-methods-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay métodos de pago registrados</h3>
            <p>Comienza creando un nuevo método de pago en el sistema</p>
            <button className="payment-methods-empty__button" onClick={handleAdd}>
              Crear Método de Pago
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedPaymentMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          onClose={handleCloseModal}
        >
              <PaymentMethodForm 
                onSubmit={handleSubmit}
                initialData={selectedPaymentMethod}
                onCancel={handleCloseModal}
                isEditing={!!selectedPaymentMethod}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

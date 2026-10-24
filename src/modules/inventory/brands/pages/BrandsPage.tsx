import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useBrands } from "../hooks/useBrands"
import { useCreateBrand } from "../hooks/useCreateBrand"
import { useUpdateBrand } from "../hooks/useUpdateBrand"
import { BrandTable } from "../components/BrandTable"
import { BrandForm } from "../components/BrandForm"
import { BrandFilters } from "../components/BrandFilters"
import { BrandSkeleton } from "../components/BrandSkeleton"
import type { Brand } from "../types/brands.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/brands.scss"
import { Button } from '@/components/ui/Button'

export const BrandsPage = () => {  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [visibleOnWeb, setVisibleOnWeb] = useState<boolean | undefined>(undefined)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const viewMode: 'list' = 'list'

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useBrands({
    search: debouncedSearch || undefined,
    status,
    visible_on_web: visibleOnWeb
  })
  
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand()
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand()

  const handleSubmit = useCallback((brandData: Partial<Brand>, imageFile?: File | null, removeLogo?: boolean) => {
  if (selectedBrand) {
    updateBrand(
      { 
        id: selectedBrand.id, 
        data: brandData as any, 
        imageFile,
        removeLogo 
      },
      {
        onSuccess: () => {
          setIsModalOpen(false)
          setSelectedBrand(null)
        }
      }
    )
  } else {
    createBrand(
      { 
        data: brandData as any, 
        imageFile 
      },
      {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      }
    )
  }
}, [selectedBrand, updateBrand, createBrand])

  const handleEdit = useCallback((brand: Brand) => {
    setSelectedBrand(brand)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedBrand(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedBrand(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setVisibleOnWeb(undefined)
  }, [])

  const handleViewModeChange = useCallback((_mode: 'grid' | 'list') => {
    // Las listas administrativas usan siempre la tabla unificada.
  }, [])

  const allBrands = data?.pages.flatMap(page => page.results) || []
  const totalBrands = data?.pages[0]?.count || 0
  const { visibleData: paginatedBrands, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allBrands, total: totalBrands, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <BrandSkeleton />
  }

  return (
    <div className="brands-page">
      {/* Header */}
      <div className="brands-page__header">
        <div className="brands-page__header-left">
          <h1 className="brands-page__title">
            Marcas
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
      <BrandFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        visibleOnWebFilter={visibleOnWeb}
        onVisibleOnWebChange={setVisibleOnWeb}
        onClearFilters={handleClearFilters}
        totalResults={totalBrands}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Brands Content */}
      <div className="brands-page__content">
        {paginatedBrands.length > 0 ? (
          <BrandTable 
            data={paginatedBrands} 
            onEdit={handleEdit}
            onRefresh={refetch}
          />
        ) : (
          <div className="brands-empty">
            <svg className="brands-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay marcas registradas</h3>
            <p>Comienza creando una nueva marca en el sistema</p>
            <button className="brands-empty__button" onClick={handleAdd}>
              Crear Marca
            </button>
          </div>
        )}
        
        <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalBrands}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedBrand ? 'Editar Marca' : 'Nueva Marca'}
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
          <BrandForm 
            onSubmit={handleSubmit}
            initialData={selectedBrand}
            onCancel={handleCloseModal}
            isEditing={!!selectedBrand}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}

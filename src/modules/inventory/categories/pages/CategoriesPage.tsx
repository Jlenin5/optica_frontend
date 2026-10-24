import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useCategories } from "../hooks/useCategories"
import { useCreateCategory } from "../hooks/useCreateCategory"
import { useUpdateCategory } from "../hooks/useUpdateCategory"
import { CategoryTable } from "../components/CategoryTable"
import { CategoryForm } from "../components/CategoryForm"
import { CategoryFilters } from "../components/CategoryFilters"
import { CategorySkeleton } from "../components/CategorySkeleton"
import type { Category } from "../types/categories.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/categories.scss"
import { Button } from '@/components/ui/Button'

export const CategoriesPage = () => {  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [visibleOnWeb, setVisibleOnWeb] = useState<boolean | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const viewMode: 'list' = 'list'

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCategories({
    search: debouncedSearch || undefined,
    status,
    visible_on_web: visibleOnWeb
  })
  
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const handleSubmit = useCallback((categoryData: Partial<Category>) => {
    if (selectedCategory) {
      updateCategory(
        { id: selectedCategory.id, data: categoryData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedCategory(null)
          }
        }
      )
    } else {
      createCategory(categoryData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedCategory, updateCategory, createCategory])

  const handleEdit = useCallback((category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setVisibleOnWeb(undefined)
  }, [])

  const handleViewModeChange = useCallback((_mode: 'grid' | 'list') => {
    // Las listas administrativas usan siempre la tabla unificada.
  }, [])

  const allCategories = data?.pages.flatMap(page => page.results) || []
  const totalCategories = data?.pages[0]?.count || 0
  const { visibleData: paginatedCategories, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allCategories, total: totalCategories, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <CategorySkeleton />
  }

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-page__header">
        <div className="categories-page__header-left">
          <h1 className="categories-page__title">
            Categorías
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
      <CategoryFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        visibleOnWebFilter={visibleOnWeb}
        onVisibleOnWebChange={setVisibleOnWeb}
        onClearFilters={handleClearFilters}
        totalResults={totalCategories}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Categories Content */}
      <div className="categories-page__content">
        {paginatedCategories.length > 0 ? (
          <CategoryTable 
            data={paginatedCategories} 
            onEdit={handleEdit}
            onRefresh={refetch}
          />
        ) : (
          <div className="categories-empty">
            <svg className="categories-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay categorías registradas</h3>
            <p>Comienza creando una nueva categoría en el sistema</p>
            <button className="categories-empty__button" onClick={handleAdd}>
              Crear Categoría
            </button>
          </div>
        )}
        
        <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalCategories}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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
              <CategoryForm 
                onSubmit={handleSubmit}
                initialData={selectedCategory}
                onCancel={handleCloseModal}
                isEditing={!!selectedCategory}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}

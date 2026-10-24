import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCreateProduct } from "../hooks/useCreateProduct"
import { useUpdateProduct } from "../hooks/useUpdateProduct"
import { ProductTable } from "../components/ProductTable"
import { ProductForm } from "../components/ProductForm"
import { ProductFilters } from "../components/ProductFilters"
import { ProductSkeleton } from "../components/ProductSkeleton"
import type { Product } from "../types/products.types"
import { useAuthStore } from "@/app/store/auth.store"
import "@styles/products.scss"
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { Button } from '@/components/ui/Button'

export const ProductsPage = () => {
  const { user, getLimitValue, plan, isSuperAdmin: userIsSuperAdmin } = useAuthStore()
  
  const [maxProducts, setMaxProducts] = useState<number | null>(null)
  const [isLoadingLimits, setIsLoadingLimits] = useState(true)
  const [limitsLoaded, setLimitsLoaded] = useState(false)
  const limitsLoadAttempted = useRef(false)
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [productType, setProductType] = useState<string>("")
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [brandId, setBrandId] = useState<number | undefined>(undefined)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProductsCount, setCurrentProductsCount] = useState(0)
  const [showWarning, setShowWarning] = useState(true)
  const viewMode: 'list' = 'list'

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useProducts({
    search: debouncedSearch || undefined,
    status,
    product_type: productType as any || undefined,
    category_id: categoryId,
    brand_id: brandId
  })
  
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return
      limitsLoadAttempted.current = true
      
      try {
        const limitValue = getLimitValue('max_products')
        setMaxProducts(limitValue !== undefined && limitValue !== null ? limitValue : null)
      } catch (error) {
        console.error('Error loading limits:', error)
        setMaxProducts(null)
      } finally {
        setIsLoadingLimits(false)
        setLimitsLoaded(true)
      }
    }
    
    loadLimits()
  }, [getLimitValue])

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  const canAddMoreProducts = useMemo(() => {
    if (isSuperAdmin) return true
    if (isLoadingLimits) return false
    return maxProducts === null || currentProductsCount < maxProducts
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, maxProducts, currentProductsCount])

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false
    if (isLoadingLimits || !limitsLoaded) return false
    if (!showWarning) return false
    if (maxProducts === null) return false
    if (currentProductsCount === 0) return false
    return currentProductsCount >= maxProducts - 1
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxProducts, currentProductsCount])

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0
    if (isLoadingLimits || !limitsLoaded) return 0
    if (!maxProducts || maxProducts === 0) return 0
    return (currentProductsCount / maxProducts) * 100
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentProductsCount, maxProducts])

  const allProducts = data?.pages.flatMap(page => page.results) || []
  const totalProducts = data?.pages[0]?.count || 0
  const { visibleData: paginatedProducts, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allProducts, total: totalProducts, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count
      setCurrentProductsCount(newCount)
    }
  }, [data])

  const handleSubmit = useCallback((productData: Partial<Product>) => {
    if (selectedProduct) {
      updateProduct(
        { id: selectedProduct.id, data: productData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }
        }
      )
    } else {
      createProduct(productData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedProduct, updateProduct, createProduct])

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setProductType("")
    setCategoryId(undefined)
    setBrandId(undefined)
  }, [])

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  const handleViewModeChange = useCallback((_mode: 'grid' | 'list') => {
    // Las listas administrativas usan siempre la tabla unificada.
  }, [])

  if (isLoading && !data) {
    return <ProductSkeleton />
  }

  return (
    <div className="products-page">
      {shouldShowWarning && maxProducts !== null && currentProductsCount > 0 && (
        <UserLimitWarning
          maxUsers={maxProducts}
          currentCount={currentProductsCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}
      
      {/* Header */}
      <div className="products-page__header">
        <div className="products-page__header-left">
          <h1 className="products-page__title">
            Productos
          </h1>
        </div>
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={!canAddMoreProducts}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
          {!canAddMoreProducts && !isSuperAdmin && (
            <span className="add-badge">Límite alcanzado</span>
          )}
        </button>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        productType={productType}
        onProductTypeChange={setProductType}
        categoryId={categoryId}
        onCategoryIdChange={setCategoryId}
        brandId={brandId}
        onBrandIdChange={setBrandId}
        onClearFilters={handleClearFilters}
        totalResults={totalProducts}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Products Content */}
      <div className="products-page__content">
        {paginatedProducts.length > 0 ? (
          <ProductTable 
            data={paginatedProducts} 
            onEdit={handleEdit}
            onRefresh={refetch}
          />
        ) : (
          <div className="products-empty">
            <h3>No hay productos registrados</h3>
            <p>Comienza creando un nuevo producto en el sistema</p>
            <button className="products-empty__button" onClick={handleAdd}>
              Crear Producto
            </button>
          </div>
        )}
        
        <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalProducts}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
          onClose={handleCloseModal}
          size="lg"
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
          <ProductForm
            onSubmit={handleSubmit}
            initialData={selectedProduct}
            onCancel={handleCloseModal}
            isEditing={!!selectedProduct}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}

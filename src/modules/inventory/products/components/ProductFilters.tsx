import MuiSvgIcon from '@components/MuiSvgIcon'
// import { useCategories } from "@/modules/inventory/categories/hooks/useCategories"
// import { useBrands } from "@/modules/inventory/brands/hooks/useBrands"

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  productType: string
  onProductTypeChange: (type: string) => void
  categoryId: number | undefined
  onCategoryIdChange: (id: number | undefined) => void
  brandId: number | undefined
  onBrandIdChange: (id: number | undefined) => void
  onClearFilters: () => void
  totalResults?: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

const PRODUCT_TYPES = [
  { value: '', label: 'Todos los tipos' },
  { value: 'product', label: 'Productos' },
  { value: 'service', label: 'Servicios' },
  { value: 'lens', label: 'Lentes' }
]

export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  productType,
  onProductTypeChange,
  categoryId,
  onCategoryIdChange,
  brandId,
  onBrandIdChange,
  onClearFilters,
  totalResults,
  viewMode,
  onViewModeChange
}: ProductFiltersProps) => {
  // const { data: categoriesData } = useCategories({ status: true, limit: 100 })
  // const { data: brandsData } = useBrands({ status: true, limit: 100 })
  
  // const categories = categoriesData?.pages.flatMap(page => page.results) || []
  // const brands = brandsData?.pages.flatMap(page => page.results) || []

  const hasActiveFilters = searchTerm || statusFilter !== undefined || productType || categoryId || brandId

  return (
    <div className="product-filters">
      <div className="product-filters__left">
        <div className="product-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o código de barras..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {totalResults !== undefined && (
          <div className="product-filters__results">
            <span>{totalResults} resultados</span>
          </div>
        )}
      </div>

      <div className="product-filters__right">
        <select 
          className="product-filters__select"
          value={productType}
          onChange={(e) => onProductTypeChange(e.target.value)}
        >
          {PRODUCT_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select 
          className="product-filters__select"
          value={categoryId || ""}
          onChange={(e) => onCategoryIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas las categorías</option>
          {/* {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))} */}
        </select>

        <select 
          className="product-filters__select"
          value={brandId || ""}
          onChange={(e) => onBrandIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas las marcas</option>
          {/* {brands.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))} */}
        </select>

        <select 
          className="product-filters__select"
          value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') onStatusFilterChange(undefined)
            else if (value === 'active') onStatusFilterChange(true)
            else onStatusFilterChange(false)
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <div className="product-filters__view-toggle">
          <button
            className={`product-filters__view-btn ${viewMode === 'grid' ? 'product-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Vista cuadrícula"
          >
            <MuiSvgIcon size={20}>lucide:layout-grid</MuiSvgIcon>
          </button>
          <button
            className={`product-filters__view-btn ${viewMode === 'list' ? 'product-filters__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Vista lista"
          >
            <MuiSvgIcon size={20}>lucide:list</MuiSvgIcon>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            className="product-filters__clear"
            onClick={onClearFilters}
            title="Limpiar filtros"
          >
            <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
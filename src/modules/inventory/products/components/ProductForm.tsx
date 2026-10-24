import { useState, useEffect } from "react"
import { useCategories } from "@categories/hooks/useCategories"
import { useBrands } from "@brands/hooks/useBrands"
import { useCompanies } from "@companies/hooks/useCompanies"
import { useAuthStore } from "@/app/store/auth.store"
import type { Product, ProductType } from "../types/products.types"

interface ProductFormProps {
  onSubmit: (data: any) => void
  initialData?: Product | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: 'product', label: 'Producto' },
  { value: 'service', label: 'Servicio' },
  { value: 'lens', label: 'Lente' }
]

export const ProductForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: ProductFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ status: true })
  const { data: brandsData, isLoading: brandsLoading } = useBrands({ status: true })
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  
  const [formData, setFormData] = useState({
    name: "",
    product_type: "product" as ProductType,
    sku: "",
    barcode: "",
    category_id: null as number | null,
    brand_id: null as number | null,
    cost: "",
    price: "",
    description: "",
    company_id: null as number | null,
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = categoriesData?.pages.flatMap(page => page.results) || []
  const brands = brandsData?.pages.flatMap(page => page.results) || []
  const companies = companiesData?.results || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        product_type: initialData.product_type || "product",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        category_id: initialData.category_id || null,
        brand_id: initialData.brand_id || null,
        cost: initialData.cost?.toString() || "",
        price: initialData.price?.toString() || "",
        description: initialData.description || "",
        company_id: initialData.company_id || null,
        status: initialData.status !== undefined ? initialData.status : true
      })
    } else {
      setFormData({
        name: "",
        product_type: "product",
        sku: "",
        barcode: "",
        category_id: null,
        brand_id: null,
        cost: "",
        price: "",
        description: "",
        company_id: isSuperAdmin ? null : currentCompanyId,
        status: true
      })
    }
  }, [initialData, isSuperAdmin, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del producto es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (!formData.price) {
      newErrors.price = "El precio es requerido"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Ingrese un precio válido"
    }
    
    if (!formData.product_type) {
      newErrors.product_type = "El tipo de producto es requerido"
    }
    
    if (isSuperAdmin && !formData.company_id) {
      newErrors.company_id = "La empresa es requerida"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      name: formData.name,
      product_type: formData.product_type,
      sku: formData.sku || null,
      barcode: formData.barcode || null,
      category_id: formData.category_id,
      brand_id: formData.brand_id,
      cost: formData.cost ? Number(formData.cost) : 0,
      price: Number(formData.price),
      description: formData.description || null,
      company_id: formData.company_id || currentCompanyId,
      status: formData.status
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (categoriesLoading || brandsLoading || companiesLoading) {
    return (
      <div className="product-form__loading">
        <div className="product-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  const currentCompanyName = user?.company?.name || 'Mi Empresa'

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form__section">
        <h4 className="product-form__section-title">Información Básica</h4>
        
        <div className="product-form__row">
          <div className="product-form__field">
            <label className="product-form__label">
              Nombre del Producto <span className="product-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Lentes de Sol Polarizados"
              className={`product-form__input ${errors.name ? 'product-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="product-form__error">{errors.name}</span>}
          </div>

          <div className="product-form__field">
            <label className="product-form__label">
              Tipo de Producto <span className="product-form__required">*</span>
            </label>
            <select
              name="product_type"
              className={`product-form__select ${errors.product_type ? 'product-form__select--error' : ''}`}
              value={formData.product_type}
              onChange={handleChange}
            >
              {PRODUCT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.product_type && <span className="product-form__error">{errors.product_type}</span>}
          </div>
        </div>

        <div className="product-form__row">
          <div className="product-form__field">
            <label className="product-form__label">SKU</label>
            <input
              type="text"
              name="sku"
              placeholder="SKU-001"
              className="product-form__input"
              value={formData.sku}
              onChange={handleChange}
            />
            <p className="product-form__helper">Código único de identificación</p>
          </div>

          <div className="product-form__field">
            <label className="product-form__label">Código de Barras</label>
            <input
              type="text"
              name="barcode"
              placeholder="1234567890123"
              className="product-form__input"
              value={formData.barcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="product-form__row">
          <div className="product-form__field">
            <label className="product-form__label">Categoría</label>
            <select
              name="category_id"
              className="product-form__select"
              value={formData.category_id || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="product-form__field">
            <label className="product-form__label">Marca</label>
            <select
              name="brand_id"
              className="product-form__select"
              value={formData.brand_id || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar marca</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="product-form__section">
        <h4 className="product-form__section-title">Precios</h4>
        
        <div className="product-form__row">
          <div className="product-form__field">
            <label className="product-form__label">Costo</label>
            <div className="product-form__price-input">
              <span className="product-form__currency">S/</span>
              <input
                type="number"
                name="cost"
                placeholder="0.00"
                step="0.01"
                min="0"
                className="product-form__input"
                value={formData.cost}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="product-form__field">
            <label className="product-form__label">
              Precio de Venta <span className="product-form__required">*</span>
            </label>
            <div className="product-form__price-input">
              <span className="product-form__currency">S/</span>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`product-form__input ${errors.price ? 'product-form__input--error' : ''}`}
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            {errors.price && <span className="product-form__error">{errors.price}</span>}
          </div>
        </div>
      </div>

      <div className="product-form__section">
        <h4 className="product-form__section-title">Descripción</h4>
        
        <div className="product-form__field">
          <textarea
            name="description"
            className="product-form__textarea"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Descripción detallada del producto..."
          />
        </div>
      </div>

      <div className="product-form__section">
        <h4 className="product-form__section-title">Configuración</h4>
        
        <div className="product-form__row">
          {isSuperAdmin && (
            <div className="product-form__field">
              <label className="product-form__label">Empresa</label>
              <select
                name="company_id"
                className="product-form__select"
                value={formData.company_id || ''}
                onChange={handleChange}
              >
                <option value="">Seleccionar empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.company_id && <span className="product-form__error">{errors.company_id}</span>}
            </div>
          )}

          {!isSuperAdmin && currentCompanyId && (
            <div className="product-form__field">
              <label className="product-form__label">Empresa</label>
              <div className="product-form__static">
                {currentCompanyName}
              </div>
              <input type="hidden" name="company_id" value={currentCompanyId} />
            </div>
          )}

          <div className="product-form__field product-form__field--checkbox">
            <label className="product-form__checkbox-label">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Producto activo</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
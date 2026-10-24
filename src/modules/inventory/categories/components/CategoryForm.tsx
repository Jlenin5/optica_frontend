import { useState, useEffect, useRef } from "react"
import { useCategories } from "../hooks/useCategories"
import { useUploadCategoryImage } from "../hooks/useUploadCategoryImage"
import type { Category } from "../types/categories.types"
import MuiSvgIcon from '@/components/MuiSvgIcon'

const api = import.meta.env.VITE_MEDIA_BASE_URL

interface CategoryFormProps {
  onSubmit: (data: any) => void
  initialData?: Category | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const CategoryForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: CategoryFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    list_order: 0,
    category_father: null as number | null,
    visible_on_web: true,
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: categoriesData } = useCategories({ status: true })
  const [uploadProgress, setUploadProgress] = useState(0)
  const { mutate: uploadImage, isPending: isUploading } = useUploadCategoryImage()
  
  const categories = categoriesData?.pages.flatMap(page => page.results) || []
  const parentCategories = categories.filter(c => c.id !== initialData?.id)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        list_order: initialData.list_order || 0,
        category_father: initialData.category_father || null,
        visible_on_web: initialData.visible_on_web !== undefined ? initialData.visible_on_web : true,
        status: initialData.status !== undefined ? initialData.status : true
      })
      if (initialData.image) {
        setImagePreview(api + initialData.image)
      }
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la categoría es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (formData.list_order < 0) {
      newErrors.list_order = "El orden debe ser un número positivo"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      name: formData.name,
      description: formData.description || null,
      list_order: formData.list_order,
      category_father: formData.category_father,
      visible_on_web: formData.visible_on_web,
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

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file && initialData?.id) {
      uploadImage({ 
        id: initialData.id, 
        file,
        onProgress: (progress) => {
          setUploadProgress(progress.percentage)
        }
      })
    }
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo no debe exceder los 2MB")
        return
      }
      if (!file.type.startsWith('image/')) {
        alert("Solo se permiten imágenes")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  {isUploading && (
    <div className="category-form__upload-progress">
      <div className="category-form__progress-bar">
        <div 
          className="category-form__progress-fill" 
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
      <span>{Math.round(uploadProgress)}%</span>
    </div>
  )}

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form__section">
        <h4 className="category-form__section-title">Información de la Categoría</h4>
        
        <div className="category-form__row">
          <div className="category-form__field">
            <label className="category-form__label">
              Nombre <span className="category-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Lentes de Sol"
              className={`category-form__input ${errors.name ? 'category-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="category-form__error">{errors.name}</span>}
          </div>

          <div className="category-form__field">
            <label className="category-form__label">Orden</label>
            <input
              type="number"
              name="list_order"
              min="0"
              className={`category-form__input ${errors.list_order ? 'category-form__input--error' : ''}`}
              value={formData.list_order}
              onChange={handleChange}
            />
            {errors.list_order && <span className="category-form__error">{errors.list_order}</span>}
            <p className="category-form__helper">Define el orden de visualización</p>
          </div>
        </div>

        <div className="category-form__row">
          <div className="category-form__field">
            <label className="category-form__label">Categoría Padre</label>
            <select
              name="category_father"
              className="category-form__select"
              value={formData.category_father || ''}
              onChange={handleChange}
            >
              <option value="">Ninguna (Categoría principal)</option>
              {parentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="category-form__helper">Selecciona una categoría padre si es subcategoría</p>
          </div>

          <div className="category-form__field">
            <label className="category-form__label">Descripción</label>
            <textarea
              name="description"
              className="category-form__textarea"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción de la categoría..."
            />
          </div>
        </div>
      </div>

      <div className="category-form__section">
        <h4 className="category-form__section-title">Imagen</h4>
        
        <div className="category-form__image-container">
          <div className="category-form__image-preview" onClick={handleImageClick}>
            {imagePreview ? (
              <img src={imagePreview} alt="Vista previa" />
            ) : (
              <div className="category-form__image-placeholder">
                <MuiSvgIcon size={32}>lucide:image</MuiSvgIcon>
                <span>Click para subir imagen</span>
              </div>
            )}
            {imagePreview && (
              <button
                type="button"
                className="category-form__image-remove"
                onClick={handleRemoveImage}
              >
                <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <p className="category-form__helper">
            Formatos: JPG, PNG, GIF. Tamaño máximo: 2MB
          </p>
        </div>
      </div>

      <div className="category-form__section">
        <h4 className="category-form__section-title">Configuración</h4>
        
        <div className="category-form__row">
          <div className="category-form__field category-form__field--checkbox">
            <label className="category-form__checkbox-label">
              <input
                type="checkbox"
                name="visible_on_web"
                checked={formData.visible_on_web}
                onChange={handleChange}
              />
              <span>Visible en la tienda web</span>
            </label>
          </div>

          <div className="category-form__field category-form__field--checkbox">
            <label className="category-form__checkbox-label">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Categoría activa</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
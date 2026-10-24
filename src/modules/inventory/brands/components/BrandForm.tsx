import { useState, useEffect, useRef } from "react"
import { useUploadBrandImage } from "../hooks/useUploadBrandImage"
import type { Brand } from "../types/brands.types"
import MuiSvgIcon from '@/components/MuiSvgIcon'

const api = import.meta.env.VITE_MEDIA_BASE_URL

interface BrandFormProps {
  onSubmit: (data: any) => void
  initialData?: Brand | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const BrandForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: BrandFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    list_order: 0,
    website_url: "",
    visible_on_web: true,
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { mutate: uploadImage, isPending: isUploading } = useUploadBrandImage()

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        list_order: initialData.list_order || 0,
        website_url: initialData.website_url || "",
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
      newErrors.name = "El nombre de la marca es requerido"
    } else if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }
    
    if (formData.list_order < 0) {
      newErrors.list_order = "El orden debe ser un número positivo"
    }
    
    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
      newErrors.website_url = "Ingrese una URL válida (ej: https://www.ejemplo.com)"
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
      website_url: formData.website_url || null,
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
      
      // Si es edición y hay imagen, subir automáticamente
      if (initialData?.id) {
        uploadImage({ id: initialData.id, file })
      }
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form className="brand-form" onSubmit={handleSubmit}>
      <div className="brand-form__section">
        <h4 className="brand-form__section-title">Información de la Marca</h4>
        
        <div className="brand-form__row">
          <div className="brand-form__field">
            <label className="brand-form__label">
              Nombre <span className="brand-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Oakley, Ray-Ban, etc."
              className={`brand-form__input ${errors.name ? 'brand-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="brand-form__error">{errors.name}</span>}
          </div>

          <div className="brand-form__field">
            <label className="brand-form__label">Orden</label>
            <input
              type="number"
              name="list_order"
              min="0"
              className={`brand-form__input ${errors.list_order ? 'brand-form__input--error' : ''}`}
              value={formData.list_order}
              onChange={handleChange}
            />
            {errors.list_order && <span className="brand-form__error">{errors.list_order}</span>}
            <p className="brand-form__helper">Define el orden de visualización</p>
          </div>
        </div>

        <div className="brand-form__row">
          <div className="brand-form__field">
            <label className="brand-form__label">Sitio Web</label>
            <input
              type="url"
              name="website_url"
              placeholder="https://www.ejemplo.com"
              className={`brand-form__input ${errors.website_url ? 'brand-form__input--error' : ''}`}
              value={formData.website_url}
              onChange={handleChange}
            />
            {errors.website_url && <span className="brand-form__error">{errors.website_url}</span>}
          </div>

          <div className="brand-form__field">
            <label className="brand-form__label">Descripción</label>
            <textarea
              name="description"
              className="brand-form__textarea"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción de la marca..."
            />
          </div>
        </div>
      </div>

      <div className="brand-form__section">
        <h4 className="brand-form__section-title">Logo / Imagen</h4>
        
        <div className="brand-form__image-container">
          <div className="brand-form__image-preview" onClick={handleImageClick}>
            {imagePreview ? (
              <img src={imagePreview} alt="Vista previa" />
            ) : (
              <div className="brand-form__image-placeholder">
                <MuiSvgIcon size={32}>lucide:image</MuiSvgIcon>
                <span>Click para subir logo</span>
              </div>
            )}
            {imagePreview && (
              <button
                type="button"
                className="brand-form__image-remove"
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
          {isUploading && (
            <div className="brand-form__upload-progress">
              <div className="brand-form__spinner"></div>
              <span>Subiendo imagen...</span>
            </div>
          )}
          <p className="brand-form__helper">
            Formatos: JPG, PNG, GIF. Tamaño máximo: 2MB
          </p>
        </div>
      </div>

      <div className="brand-form__section">
        <h4 className="brand-form__section-title">Configuración</h4>
        
        <div className="brand-form__row">
          <div className="brand-form__field brand-form__field--checkbox">
            <label className="brand-form__checkbox-label">
              <input
                type="checkbox"
                name="visible_on_web"
                checked={formData.visible_on_web}
                onChange={handleChange}
              />
              <span>Visible en la tienda web</span>
            </label>
          </div>

          <div className="brand-form__field brand-form__field--checkbox">
            <label className="brand-form__checkbox-label">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Marca activa</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
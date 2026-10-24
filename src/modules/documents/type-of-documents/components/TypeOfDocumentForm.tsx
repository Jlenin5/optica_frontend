import { useForm } from "react-hook-form"
import { type TypeOfDocumentFormData } from "../schemas/type-of-document.schema"
import { useEffect } from "react"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface TypeOfDocumentFormProps {
  onSubmit: (data: TypeOfDocumentFormData) => void
  onCancel: () => void
  initialData?: TypeOfDocumentFormData | null
  isEditing?: boolean
  isLoading?: boolean
}

export const TypeOfDocumentForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false,
  isLoading = false 
}: TypeOfDocumentFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TypeOfDocumentFormData>({
    defaultValues: {
      description: '',
      abbreviation: '',
      code: '',
      status: true,
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="type-of-document-form">
      <div className="type-of-document-form__field">
        <label htmlFor="description" className="type-of-document-form__label">
          Descripción *
        </label>
        <div className="type-of-document-form__input-wrapper">
          <MuiSvgIcon className="type-of-document-form__icon" size={20}>
            lucide:file-text
          </MuiSvgIcon>
          <input
            id="description"
            type="text"
            required
            {...register("description")}
            className={`type-of-document-form__input ${errors.description ? 'type-of-document-form__input--error' : ''}`}
            placeholder="Ej: Documento Nacional de Identidad"
          />
        </div>
        {errors.description && (
          <p className="type-of-document-form__error">{errors.description.message}</p>
        )}
      </div>

      <div className="type-of-document-form__row">
        <div className="type-of-document-form__field">
          <label htmlFor="abbreviation" className="type-of-document-form__label">
            Abreviatura
          </label>
          <div className="type-of-document-form__input-wrapper">
            <MuiSvgIcon className="type-of-document-form__icon" size={20}>
              lucide:hash
            </MuiSvgIcon>
            <input
              id="abbreviation"
              type="text"
              {...register("abbreviation")}
              className="type-of-document-form__input"
              placeholder="Ej: DNI"
            />
          </div>
        </div>

        <div className="type-of-document-form__field">
          <label htmlFor="code" className="type-of-document-form__label">
            Código
          </label>
          <div className="type-of-document-form__input-wrapper">
            <MuiSvgIcon className="type-of-document-form__icon" size={20}>
              lucide:code
            </MuiSvgIcon>
            <input
              id="code"
              type="text"
              {...register("code")}
              className="type-of-document-form__input"
              placeholder="Ej: 01"
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="type-of-document-form__field">
          <label className="type-of-document-form__label">
            Estado
          </label>
          <div className="type-of-document-form__checkbox">
            <input
              type="checkbox"
              id="status"
              {...register("status")}
            />
            <label htmlFor="status">Activo</label>
          </div>
        </div>
      )}

      <div className="type-of-document-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="type-of-document-form__btn type-of-document-form__btn--cancel"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="type-of-document-form__btn type-of-document-form__btn--submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="type-of-document-form__spinner"></span>
              {isEditing ? 'Actualizando...' : 'Guardando...'}
            </>
          ) : (
            'Guardar'
          )}
        </button>
      </div>
    </form>
  )
}
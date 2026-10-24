import { useState } from 'react'
import { CatalogPage } from '@/modules/laboratory/components/CatalogPage'
import { useCreateLensFeature, useDeleteLensFeature, useLensFeatures, useUpdateLensFeature } from '../hooks'
import type { LensFeature, LensFeatureDTO, LensFeatureType } from '../types/lens-types.types'
import { unwrapResults } from '@/modules/laboratory/common'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import '@/styles/laboratory.scss'

const TYPES: Array<{ value: LensFeatureType; label: string }> = [
  { value: 'FOCUS', label: 'Tipo de foco' },
  { value: 'MATERIAL', label: 'Material' },
  { value: 'SERVICE', label: 'Servicio' },
  { value: 'TREATMENT', label: 'Tratamiento' },
  { value: 'INDEX', label: 'Índice' },
  { value: 'FILTER', label: 'Filtro' },
  { value: 'OTHER', label: 'Otro' },
]

const emptyForm: LensFeatureDTO = { type: 'FOCUS', code: '', name: '', description: '', status: true }

export const LensFeaturesPage = () => {
  const [selected, setSelected] = useState<LensFeature | null>(null)
  const [form, setForm] = useState<LensFeatureDTO>(emptyForm)
  const { data, isLoading } = useLensFeatures({ limit: 100 })
  const create = useCreateLensFeature()
  const update = useUpdateLensFeature()
  const del = useDeleteLensFeature()
  const items = unwrapResults(data ?? []) as LensFeature[]
  const saving = create.isPending || update.isPending

  const save = (close: () => void) => {
    const options = { onSuccess: close }
    if (selected) update.mutate({ id: selected.id, data: form }, options)
    else create.mutate(form, options)
  }

  return (
    <CatalogPage
      title="Características de lunas"
      description="Define atributos reutilizables que después puedes asociar a cada tipo de luna."
      items={items}
      loading={isLoading}
      searchPlaceholder="Buscar por código, nombre o descripción…"
      modalTitle={selected ? 'Editar característica' : 'Nueva característica'}
      modalDescription="Configura el atributo y su información básica."
      modalSize="md"
      columns={[
        { label: 'Tipo', render: x => <span className="lab-type-chip">{TYPES.find(t => t.value === x.type)?.label || x.type}</span> },
        { label: 'Código', render: x => <span className="lab-code">{x.code}</span> },
        { label: 'Nombre', render: x => <strong>{x.name}</strong> },
        { label: 'Descripción', render: x => <span className="lab-description">{x.description || '—'}</span> },
        { label: 'Estado', render: x => <span className={`lab-status ${x.status ? 'lab-status--active' : 'lab-status--inactive'}`}>{x.status ? 'Activo' : 'Inactivo'}</span> },
      ]}
      onAdd={() => { setSelected(null); setForm({ ...emptyForm }) }}
      onEdit={x => { setSelected(x); setForm({ type: x.type, code: x.code, name: x.name, description: x.description, status: x.status }) }}
      onDelete={x => del.mutate(x.id)}
      renderForm={() => (
        <div className="catalog-form">
          <div className="catalog-form__section">
            <div className="catalog-form__section-title">
              <span className="catalog-form__section-icon"><MuiSvgIcon size={16}>lucide:sliders-horizontal</MuiSvgIcon></span>
              <div><h3>Información de la característica</h3><p>Los campos marcados con <b>*</b> son obligatorios.</p></div>
            </div>

            <div className="catalog-form__grid catalog-form__grid--2">
              <div className="catalog-form__field">
                <label htmlFor="feature-type">Tipo <span>*</span></label>
                <select id="feature-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as LensFeatureType })}>
                  {TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                <small className="catalog-form__hint">Clasifica el atributo para encontrarlo más rápido.</small>
              </div>

              <div className="catalog-form__field">
                <label htmlFor="feature-code">Código <span>*</span></label>
                <input id="feature-code" maxLength={50} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Ej. BLUECUT" />
                <small className="catalog-form__counter">{form.code.length}/50</small>
              </div>

              <div className="catalog-form__field catalog-form__field--full">
                <label htmlFor="feature-name">Nombre <span>*</span></label>
                <input id="feature-name" maxLength={150} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej. Filtro de luz azul" />
              </div>

              <div className="catalog-form__field catalog-form__field--full">
                <label htmlFor="feature-description">Descripción <small>(opcional)</small></label>
                <textarea id="feature-description" maxLength={1000} rows={4} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe brevemente esta característica…" />
              </div>
            </div>
          </div>

          <label className="catalog-switch">
            <input type="checkbox" checked={form.status !== false} onChange={e => setForm({ ...form, status: e.target.checked })} />
            <span className="catalog-switch__track" />
            <span><b>Característica activa</b><small>Disponible para asociarla a tipos de luna.</small></span>
          </label>
        </div>
      )}
      renderFooter={close => (
        <>
          <button type="button" className="catalog-btn catalog-btn--secondary" onClick={close}>Cerrar</button>
          <button type="button" className="catalog-btn catalog-btn--primary" disabled={saving || !form.code.trim() || !form.name.trim()} onClick={() => save(close)}>
            {saving ? <><span className="lab-spinner lab-spinner--button" />Guardando…</> : <><MuiSvgIcon size={16}>lucide:save</MuiSvgIcon>Guardar</>}
          </button>
        </>
      )}
    />
  )
}

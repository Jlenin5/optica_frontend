import { useState } from 'react'
import { CatalogPage } from '@/modules/laboratory/components/CatalogPage'
import { useCreateLensType, useDeleteLensType, useLensFeatures, useLensTypes, useUpdateLensType } from '../hooks'
import type { LensType, LensTypeDTO } from '../types/lens-types.types'
import { unwrapResults } from '@/modules/laboratory/common'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import '@/styles/laboratory.scss'

const emptyForm: LensTypeDTO = { code: '', name: '', description: '', base_price: 0, feature_ids: [], status: true }

export const LensTypesPage = () => {
  const [selected, setSelected] = useState<LensType | null>(null)
  const [form, setForm] = useState<LensTypeDTO>(emptyForm)
  const { data, isLoading } = useLensTypes({ limit: 100 })
  const { data: featuresData } = useLensFeatures({ limit: 100, status: true })
  const features = unwrapResults(featuresData ?? [])
  const items = unwrapResults(data ?? []) as LensType[]
  const create = useCreateLensType()
  const update = useUpdateLensType()
  const del = useDeleteLensType()
  const saving = create.isPending || update.isPending

  const toggleFeature = (id: number) => setForm(prev => ({
    ...prev,
    feature_ids: prev.feature_ids.includes(id)
      ? prev.feature_ids.filter(featureId => featureId !== id)
      : [...prev.feature_ids, id],
  }))

  const save = (close: () => void) => {
    const options = { onSuccess: close }
    if (selected) update.mutate({ id: selected.id, data: form }, options)
    else create.mutate(form, options)
  }

  return (
    <CatalogPage
      title="Tipos de lunas"
      description="Administra las categorías de lunas, su precio base y las características que las componen."
      items={items}
      loading={isLoading}
      searchPlaceholder="Buscar por código, nombre o descripción…"
      modalTitle={selected ? 'Editar tipo de luna' : 'Nuevo tipo de luna'}
      modalDescription="Define los datos comerciales y las características que aplican a este tipo."
      modalSize="lg"
      columns={[
        { label: 'Código', render: x => <span className="lab-code">{x.code}</span> },
        { label: 'Tipo de luna', render: x => <div className="lab-cell-main"><strong>{x.name}</strong><small>{x.description || 'Sin descripción'}</small></div> },
        { label: 'Precio base', render: x => <strong className="lab-price">S/ {Number(x.base_price).toFixed(2)}</strong> },
        { label: 'Características', render: x => <span className="lab-count-pill">{x.features?.length || 0} asociada(s)</span> },
        { label: 'Estado', render: x => <span className={`lab-status ${x.status ? 'lab-status--active' : 'lab-status--inactive'}`}>{x.status ? 'Activo' : 'Inactivo'}</span> },
      ]}
      onAdd={() => { setSelected(null); setForm({ ...emptyForm, feature_ids: [] }) }}
      onEdit={x => { setSelected(x); setForm({ code: x.code, name: x.name, description: x.description, base_price: Number(x.base_price), feature_ids: x.features?.map(f => f.id) || [], status: x.status }) }}
      onDelete={x => del.mutate(x.id)}
      renderForm={() => (
        <div className="catalog-form">
          <div className="catalog-form__section">
            <div className="catalog-form__section-title">
              <span className="catalog-form__section-icon"><MuiSvgIcon size={16}>lucide:scan-eye</MuiSvgIcon></span>
              <div><h3>Datos del tipo de luna</h3><p>El precio base se expresa en soles (S/).</p></div>
            </div>

            <div className="catalog-form__grid catalog-form__grid--2">
              <div className="catalog-form__field">
                <label htmlFor="lens-type-code">Código <span>*</span></label>
                <input id="lens-type-code" maxLength={50} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Ej. MONO" />
                <small className="catalog-form__counter">{form.code.length}/50</small>
              </div>
              <div className="catalog-form__field">
                <label htmlFor="lens-type-name">Nombre <span>*</span></label>
                <input id="lens-type-name" maxLength={150} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej. Monofocal" />
              </div>
              <div className="catalog-form__field">
                <label htmlFor="lens-type-price">Precio base <span>*</span></label>
                <div className="catalog-money">
                  <span>S/</span>
                  <input id="lens-type-price" type="number" min="0" step="0.01" value={form.base_price} onChange={e => setForm({ ...form, base_price: Math.max(0, Number(e.target.value)) })} />
                </div>
              </div>
              <div className="catalog-form__field">
                <label>Estado</label>
                <label className="catalog-switch catalog-switch--inline">
                  <input type="checkbox" checked={form.status !== false} onChange={e => setForm({ ...form, status: e.target.checked })} />
                  <span className="catalog-switch__track" />
                  <span><b>{form.status !== false ? 'Activo' : 'Inactivo'}</b><small>Disponibilidad del catálogo</small></span>
                </label>
              </div>
              <div className="catalog-form__field catalog-form__field--full">
                <label htmlFor="lens-type-description">Descripción <small>(opcional)</small></label>
                <textarea id="lens-type-description" maxLength={1000} rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe el tipo de luna…" />
              </div>
            </div>
          </div>

          <div className="catalog-form__section catalog-form__section--features">
            <div className="catalog-form__section-title">
              <span className="catalog-form__section-icon"><MuiSvgIcon size={16}>lucide:tags</MuiSvgIcon></span>
              <div><h3>Características</h3><p>Selecciona los atributos que aplican a este tipo de luna.</p></div>
              <span className="catalog-form__selected-count">{form.feature_ids.length} seleccionada(s)</span>
            </div>

            {features.length === 0 ? (
              <div className="catalog-form__empty-features">
                <MuiSvgIcon size={22}>lucide:tags</MuiSvgIcon>
                <span>No hay características activas disponibles.</span>
              </div>
            ) : (
              <div className="catalog-feature-grid">
                {features.map((feature: any) => (
                  <label className={`catalog-feature ${form.feature_ids.includes(feature.id) ? 'is-selected' : ''}`} key={feature.id}>
                    <input type="checkbox" checked={form.feature_ids.includes(feature.id)} onChange={() => toggleFeature(feature.id)} />
                    <span className="catalog-feature__check"><MuiSvgIcon size={13}>lucide:check</MuiSvgIcon></span>
                    <span className="catalog-feature__content"><b>{feature.name}</b><small>{feature.code} · {feature.type}</small></span>
                  </label>
                ))}
              </div>
            )}
          </div>
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

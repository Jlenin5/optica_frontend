import { useState } from 'react'
import { CatalogPage } from '@/modules/laboratory/components/CatalogPage'
import { useCreateLaboratory, useDeleteLaboratory, useLaboratories, useUpdateLaboratory } from '../hooks'
import type { Laboratory, LaboratoryDTO } from '../types/laboratories.types'
import { unwrapResults } from '@/modules/laboratory/common'
import { useAuthStore } from '@/app/store/auth.store'
import { useCompanies } from '@/modules/organizations/companies/hooks/useCompanies'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import '@/styles/laboratory.scss'

const emptyForm: LaboratoryDTO = {
  name: '', trade_name: '', tax_id: '', email: '', phone: '',
  address: '', contact_name: '', notes: '', status: true,
}

export const LaboratoriesPage = () => {
  const [selected, setSelected] = useState<Laboratory | null>(null)
  const [form, setForm] = useState<LaboratoryDTO>(emptyForm)
  const { isSuperAdmin, currentCompanyId } = useAuthStore()
  const { data: companiesData } = useCompanies({ status: true })
  const { data, isLoading } = useLaboratories()
  const create = useCreateLaboratory()
  const update = useUpdateLaboratory()
  const del = useDeleteLaboratory()
  const items = unwrapResults(data?.pages?.flatMap((page: any) => page.results) ?? []) as Laboratory[]
  const [companyId, setCompanyId] = useState<number | null>(currentCompanyId)
  const companies = (companiesData?.results ?? []) as Array<{ id: number; name: string; ruc?: string }>
  const saving = create.isPending || update.isPending

  const setField = <K extends keyof LaboratoryDTO>(key: K, value: LaboratoryDTO[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const save = (close: () => void) => {
    const payload = isSuperAdmin && companyId
      ? ({ ...form, company_id: companyId } as LaboratoryDTO & { company_id?: number })
      : form

    const options = { onSuccess: close }
    if (selected) update.mutate({ id: selected.id, data: payload }, options)
    else create.mutate(payload, options)
  }

  return (
    <CatalogPage
      title="Laboratorios"
      description="Gestiona los laboratorios que fabrican las lunas para tu empresa."
      items={items}
      loading={isLoading}
      searchPlaceholder="Buscar por nombre, RUC, email o contacto…"
      modalTitle={selected ? 'Editar laboratorio' : 'Nuevo laboratorio'}
      modalDescription="Registra los datos comerciales y de contacto del laboratorio."
      modalSize="lg"
      columns={[
        { label: 'Laboratorio', render: x => <div className="lab-cell-main"><strong>{x.trade_name || x.name}</strong><small>{x.trade_name ? x.name : 'Razón social'}</small></div> },
        { label: 'RUC / ID fiscal', render: x => <span className="lab-code">{x.tax_id || '—'}</span> },
        { label: 'Contacto', render: x => <div className="lab-cell-main"><strong>{x.contact_name || 'Sin contacto'}</strong><small>{x.phone || x.email || 'Sin datos'}</small></div> },
        { label: 'Estado', render: x => <span className={`lab-status ${x.status ? 'lab-status--active' : 'lab-status--inactive'}`}>{x.status ? 'Activo' : 'Inactivo'}</span> },
      ]}
      onAdd={() => { setSelected(null); setForm({ ...emptyForm }); setCompanyId(currentCompanyId) }}
      onEdit={x => {
        setSelected(x)
        setCompanyId(x.company_id || currentCompanyId)
        setForm({
          name: x.name, trade_name: x.trade_name, tax_id: x.tax_id, email: x.email,
          phone: x.phone, address: x.address, contact_name: x.contact_name,
          notes: x.notes, status: x.status,
        })
      }}
      onDelete={x => del.mutate(x.id)}
      renderForm={() => (
        <div className="catalog-form">
          <div className="catalog-form__section">
            <div className="catalog-form__section-title">
              <span className="catalog-form__section-icon"><MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon></span>
              <div><h3>Datos del laboratorio</h3><p>Completa la información principal del proveedor.</p></div>
            </div>

            <div className="catalog-form__grid catalog-form__grid--2">
              {isSuperAdmin && (
                <div className="catalog-form__field catalog-form__field--full">
                  <label htmlFor="laboratory-company">Empresa <span>*</span></label>
                  <select id="laboratory-company" value={companyId || ''} onChange={e => setCompanyId(Number(e.target.value) || null)}>
                    <option value="">Seleccionar empresa…</option>
                    {companies.map(company => <option key={company.id} value={company.id}>{company.name}{company.ruc ? ` · ${company.ruc}` : ''}</option>)}
                  </select>
                </div>
              )}

              <div className="catalog-form__field">
                <label htmlFor="laboratory-name">Razón social <span>*</span></label>
                <input id="laboratory-name" maxLength={150} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nombre legal del laboratorio" />
              </div>

              <div className="catalog-form__field">
                <label htmlFor="laboratory-trade-name">Nombre comercial <small>(opcional)</small></label>
                <input id="laboratory-trade-name" maxLength={150} value={form.trade_name || ''} onChange={e => setField('trade_name', e.target.value)} placeholder="Nombre con el que opera" />
              </div>

              <div className="catalog-form__field">
                <label htmlFor="laboratory-tax-id">RUC / ID fiscal <small>(opcional)</small></label>
                <input id="laboratory-tax-id" maxLength={20} value={form.tax_id || ''} onChange={e => setField('tax_id', e.target.value)} placeholder="Ej. 20123456789" />
              </div>

              <div className="catalog-form__field">
                <label htmlFor="laboratory-contact">Persona de contacto <small>(opcional)</small></label>
                <input id="laboratory-contact" maxLength={150} value={form.contact_name || ''} onChange={e => setField('contact_name', e.target.value)} placeholder="Nombre del contacto" />
              </div>

              <div className="catalog-form__field">
                <label htmlFor="laboratory-email">Correo electrónico <small>(opcional)</small></label>
                <input id="laboratory-email" type="email" maxLength={150} value={form.email || ''} onChange={e => setField('email', e.target.value)} placeholder="contacto@laboratorio.com" />
              </div>

              <div className="catalog-form__field">
                <label htmlFor="laboratory-phone">Teléfono <small>(opcional)</small></label>
                <input id="laboratory-phone" inputMode="tel" maxLength={30} value={form.phone || ''} onChange={e => setField('phone', e.target.value)} placeholder="+51 999 999 999" />
              </div>

              <div className="catalog-form__field catalog-form__field--full">
                <label htmlFor="laboratory-address">Dirección <small>(opcional)</small></label>
                <input id="laboratory-address" maxLength={255} value={form.address || ''} onChange={e => setField('address', e.target.value)} placeholder="Dirección del laboratorio" />
              </div>

              <div className="catalog-form__field catalog-form__field--full">
                <label htmlFor="laboratory-notes">Notas <small>(opcional)</small></label>
                <textarea id="laboratory-notes" rows={4} value={form.notes || ''} onChange={e => setField('notes', e.target.value)} placeholder="Información adicional, horarios, condiciones de atención…" />
              </div>
            </div>
          </div>

          <label className="catalog-switch">
            <input type="checkbox" checked={form.status !== false} onChange={e => setField('status', e.target.checked)} />
            <span className="catalog-switch__track" />
            <span><b>Laboratorio activo</b><small>Podrá seleccionarse en las operaciones del módulo.</small></span>
          </label>
        </div>
      )}
      renderFooter={close => (
        <>
          <button type="button" className="catalog-btn catalog-btn--secondary" onClick={close}>Cerrar</button>
          <button type="button" className="catalog-btn catalog-btn--primary" disabled={saving || !form.name.trim() || (isSuperAdmin && !companyId)} onClick={() => save(close)}>
            {saving ? <><span className="lab-spinner lab-spinner--button" />Guardando…</> : <><MuiSvgIcon size={16}>lucide:save</MuiSvgIcon>Guardar</>}
          </button>
        </>
      )}
    />
  )
}

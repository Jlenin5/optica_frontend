import { useState } from "react"
import { useSettings } from "../hooks/useSettings"
import { CompanySettingsForm } from "../components/CompanySettingsForm"
import { NotificationSettingsForm } from "../components/NotificationSettingsForm"
import { SecuritySettingsForm } from "../components/SecuritySettingsForm"
import { InvoiceSettingsForm } from "../components/InvoiceSettingsForm"
import { SystemSettingsForm } from "../components/SystemSettingsForm"
import { BranchOfficesList } from "../components/BranchOfficesList"
import { SettingsSkeleton } from "../components/SettingsSkeleton"
import { useAuthStore } from "@/app/store/auth.store"
import "@styles/settings.scss"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import { SequencesForm } from "../components/SequencesForm"

type SettingsTab = 'company' | 'notifications' | 'security' | 'invoice' | 'series-of-vouchers' | 'system' | 'branch-offices'

export const SettingsPage = () => {
  const { isSuperAdmin } = useAuthStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>('company')
  const { company, notifications, security, invoice, system, branchOffices, isLoading } = useSettings()

  const tabs = [
    { id: 'company', label: 'Empresa', icon: 'lucide:building-2', adminOnly: false },
    { id: 'notifications', label: 'Notificaciones', icon: 'lucide:bell', adminOnly: false },
    { id: 'security', label: 'Seguridad', icon: 'lucide:shield', adminOnly: false },
    { id: 'invoice', label: 'Facturación', icon: 'lucide:file-text', adminOnly: false },
    { id: 'series-of-vouchers', label: 'Series de Comprobantes', icon: 'lucide:layers', adminOnly: false},
    { id: 'system', label: 'Sistema', icon: 'lucide:settings', adminOnly: true },
    { id: 'branch-offices', label: 'Sucursales', icon: 'lucide:map-pin', adminOnly: false }
  ]

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || (tab.adminOnly && isSuperAdmin))

  if (isLoading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="settings-page__title">Configuración</h1>
        <p className="settings-page__subtitle">
          Gestiona la configuración de tu cuenta y preferencias del sistema
        </p>
      </div>

      <div className="settings-page__layout">
        <div className="settings-page__sidebar">
          <nav className="settings-nav">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-nav__item ${activeTab === tab.id ? 'settings-nav__item--active' : ''}`}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
              >
                <MuiSvgIcon size={20}>{tab.icon}</MuiSvgIcon>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-page__content">
          {activeTab === 'company' && company.data && (
            <CompanySettingsForm settings={company.data} />
          )}
          
          {activeTab === 'notifications' && notifications.data && (
            <NotificationSettingsForm settings={notifications.data} />
          )}
          
          {activeTab === 'security' && security.data && (
            <SecuritySettingsForm settings={security.data} />
          )}
          
          {activeTab === 'invoice' && invoice.data && (
            <InvoiceSettingsForm settings={invoice.data} />
          )}

          {activeTab === 'series-of-vouchers' && invoice.data && (
            <SequencesForm />
          )}
          
          {activeTab === 'system' && system.data && isSuperAdmin && (
            <SystemSettingsForm settings={system.data} />
          )}
          
          {activeTab === 'branch-offices' && branchOffices.data && (
            <BranchOfficesList branchOffices={branchOffices.data} />
          )}
        </div>
      </div>
    </div>
  )
}
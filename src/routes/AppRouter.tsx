import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { UnauthorizedPage } from "@/modules/auth/pages/UnauthorizedPage"
import { PrivateRoute } from "./PrivateRoute"
import { MainLayout } from "@/layouts/MainLayout"
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage"
import { PatientsPage } from "@/modules/clinical/patients/pages/PatientsPage"
import { AppointmentsPage } from "@appointments/pages/AppointmentsPage"
import { RolesPage } from "@/modules/roles/pages/RolesPage"
import { UsersPage } from "@/modules/users/pages/UsersPage"
import { StatusesPage } from "@/modules/statuses/pages/StatusesPage"
import { TypeOfDocumentsPage } from "@type-of-documents/pages/TypeOfDocumentsPage"
import { CompaniesPage } from "@/modules/organizations/companies/pages/CompaniesPage"
import { PlansPage } from "@/modules/billing/plans/pages/PlansPage"
import { SubscriptionsPage } from "@/modules/billing/subscriptions/pages/SubscriptionsPage"
import { LimitsPage } from "@/modules/billing/limits/pages/LimitsPage"
import { PlanLimitsPage } from "@/modules/billing/limits/pages/PlanLimitsPage"
import { FeaturesPage } from "@/modules/billing/features/pages/FeaturesPage"
import { PlanFeaturesPage } from "@/modules/billing/features/pages/PlanFeaturesPage"
import { ReceiptsPage } from "@/modules/documents/receipts/pages/ReceiptsPage"
import { BranchOfficesPage } from "@/modules/organizations/branch-offices/pages/BranchOfficesPage"
import { WarehousesPage } from "@/modules/organizations/warehouses/pages/WarehousesPage"
import { StoresPage } from "@/modules/organizations/stores/pages/StoresPage"
import { SchedulePage } from "@appointments/pages/SchedulePage"
import { CalendarPage } from "@/modules/clinical/appointments/pages/CalendarPage"
import { ProfilePage } from "@/modules/profile/pages/ProfilePage"
import { SettingsPage } from "@/modules/settings/pages/SettingsPage"
import { ProductsPage } from "@/modules/inventory/products/pages/ProductsPage"
import { CategoriesPage } from "@/modules/inventory/categories/pages/CategoriesPage"
import { BrandsPage } from "@/modules/inventory/brands/pages/BrandsPage"
import { StockPage } from "@/modules/inventory/stock/pages/StockPage"
import { PrescriptionPage } from "@/modules/clinical/prescriptions/pages/PrescriptionPage"
import { PatientPrescriptionsPage } from "@/modules/clinical/patients/pages/PatientPrescriptionsPage"
import { CreatePrescriptionPage } from "@/modules/clinical/prescriptions/pages/CreatePrescriptionPage"
import { CreateExternalPrescriptionPage } from "@/modules/clinical/prescriptions/pages/CreateExternalPrescriptionPage"
import { PatientDetailPage } from "@/modules/clinical/patients/pages/PatientDetailPage"
import { CurrenciesPage } from "@/modules/finance/accounting/currencies/pages/CurrenciesPage"
import { DaysOfCreditPage } from "@/modules/finance/accounting/days_of_credit/pages/DaysOfCreditPage"
import { ExchangeRatesPage } from "@/modules/finance/accounting/exchange_rates/pages/ExchangeRatesPage"
import { TaxesPage } from "@/modules/finance/accounting/taxes/pages/TaxesPage"
import { BanksPage } from "@/modules/finance/banking/banks/pages/BanksPage"
import { BankAccountsPage } from "@/modules/finance/banking/bank-accounts/pages/BankAccountsPage"
import { PaymentMethodsPage } from "@/modules/finance/payments/payment_methods/pages/PaymentMethodsPage"
import { PaymentTypesPage } from "@/modules/finance/payments/payment_types/pages/PaymentTypesPage"
import { CashRegistersPage } from "@/modules/finance/cash/cash_registers/pages/CashRegistersPage"
import { CashRegisterClosePage } from "@/modules/finance/cash/cash_registers/pages/CashRegisterClosePage"
import { OpenCashRegisterPage } from "@/modules/finance/cash/cash_registers/pages/OpenCashRegisterPage"
import { CashRegisterSessionsPage } from "@/modules/finance/cash/cash_registers/pages/CashRegisterSessionsPage"
import { CloseCashRegisterSessionPage } from "@/modules/finance/cash/cash_registers/pages/CloseCashRegisterSessionPage"
import { CashMovementsPage } from "@/modules/finance/cash/cash_movements/pages/CashMovementsPage"
import { SalesPage } from "@/modules/commercial/sales/pages/SalesPage"
import { SaleForm } from "@/modules/commercial/sales/components/SaleForm"
import { ROUTES } from "@/app/config/routes"
import { ConsultationsPage } from "@/modules/clinical/consultations/pages/ConsultationsPage"
import { ConsultationDetailPage } from "@/modules/clinical/consultations/pages/ConsultationDetailPage"
import { MedicalRecordPage } from "@/modules/clinical/medical_records/pages/MedicalRecordPage"
import { AppointmentDetailPage } from "@/modules/clinical/appointments/pages/AppointmentDetailPage"
import { ServicesPage } from "@/modules/commercial/services/pages/ServicesPage"
import { LaboratoriesPage } from "@/modules/laboratory/laboratories/pages/LaboratoriesPage"
import { LensFeaturesPage } from "@/modules/laboratory/lens_types/pages/LensFeaturesPage"
import { LensTypesPage } from "@/modules/laboratory/lens_types/pages/LensTypesPage"
import { LaboratoryOrdersPage } from "@/modules/laboratory/laboratory_orders/pages/LaboratoryOrdersPage"
import { CustomersPage } from "@/modules/commercial/customers/pages/CustomersPage"
import { QuotesPage } from "@/modules/commercial/quotes/pages/QuotesPage"
import { CreateQuotePage } from "@/modules/commercial/quotes/pages/CreateQuotePage"
import { RepairsPage } from "@/modules/operations/pages/RepairsPage"
import { DeliveriesPage } from "@/modules/operations/pages/DeliveriesPage"
import { WorkflowsPage } from "@/modules/operations/pages/WorkflowsPage"
import { PurchasesPage } from "@/modules/inventory/purchases/pages/PurchasesPage"
import { TransfersPage } from "@/modules/inventory/transfers/pages/TransfersPage"
import { LaboratoryQualityPage } from "@/modules/laboratory/quality/pages/LaboratoryQualityPage"
import { ReportsPage } from "@/modules/reports/pages/ReportsPage"
import { AuditPage } from "@/modules/reports/pages/AuditPage"


const ProtectedRouteLayout = ({ children }: { children: React.ReactNode }) => (
  <PrivateRoute>
    <MainLayout>{children}</MainLayout>
  </PrivateRoute>
)

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRouteLayout>
              <DashboardPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRouteLayout>
              <ProfilePage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRouteLayout>
              <SettingsPage />
            </ProtectedRouteLayout>
          }
        />

        <Route path={ROUTES.CUSTOMERS} element={<ProtectedRouteLayout><CustomersPage /></ProtectedRouteLayout>} />

        <Route
          path={ROUTES.PATIENTS}
          element={
            <ProtectedRouteLayout>
              <PatientsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.PATIENT_DETAIL}
          element={
            <ProtectedRouteLayout>
              <PatientDetailPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.PATIENT_PRESCRIPTIONS}
          element={
            <ProtectedRouteLayout>
              <PatientPrescriptionsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.NEW_EXTERNAL_PRESCRIPTION}
          element={
            <ProtectedRouteLayout>
              <CreateExternalPrescriptionPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.MEDICAL_RECORD}
          element={
            <ProtectedRouteLayout>
              <MedicalRecordPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.CONSULTATIONS}
          element={
            <ProtectedRouteLayout>
              <ConsultationsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.CONSULTATION_DETAIL}
          element={
            <ProtectedRouteLayout>
              <ConsultationDetailPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.CONSULTATION_PRESCRIPTION}
          element={
            <ProtectedRouteLayout>
              <CreatePrescriptionPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.APPOINTMENTS}
          element={
            <ProtectedRouteLayout>
              <AppointmentsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.APPOINTMENTS_CALENDAR}
          element={
            <ProtectedRouteLayout>
              <CalendarPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.NEW_APPOINTMENT}
          element={
            <ProtectedRouteLayout>
              <SchedulePage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.APPOINTMENT_DETAIL}
          element={
            <ProtectedRouteLayout>
              <AppointmentDetailPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.APPOINTMENT_PRESCRIPTION}
          element={
            <ProtectedRouteLayout>
              <PrescriptionPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.SALES}
          element={
            <ProtectedRouteLayout>
              <SalesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.CREATE_SALE}
          element={
            <ProtectedRouteLayout>
              <SaleForm isEditing={false} />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.EDIT_SALE}
          element={
            <ProtectedRouteLayout>
              <SaleForm isEditing={true} />
            </ProtectedRouteLayout>
          }
        />

        <Route path={ROUTES.QUOTES} element={<ProtectedRouteLayout><QuotesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.CREATE_QUOTE} element={<ProtectedRouteLayout><CreateQuotePage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.EDIT_QUOTE} element={<ProtectedRouteLayout><CreateQuotePage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.LABORATORY_QUALITY} element={<ProtectedRouteLayout><LaboratoryQualityPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.OPERATIONS_WORKFLOWS} element={<ProtectedRouteLayout><WorkflowsPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.OPERATIONS_REPAIRS} element={<ProtectedRouteLayout><RepairsPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.OPERATIONS_DELIVERIES} element={<ProtectedRouteLayout><DeliveriesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.REPORTS} element={<ProtectedRouteLayout><ReportsPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.REPORTS_AUDIT} element={<ProtectedRouteLayout><AuditPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.SERVICES} element={<ProtectedRouteLayout><ServicesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.LABORATORIES} element={<ProtectedRouteLayout><LaboratoriesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.LENS_FEATURES} element={<ProtectedRouteLayout><LensFeaturesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.LENS_TYPES} element={<ProtectedRouteLayout><LensTypesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.LABORATORY_ORDERS} element={<ProtectedRouteLayout><LaboratoryOrdersPage /></ProtectedRouteLayout>} />

        <Route
          path={ROUTES.INVENTORY_CATEGORIES}
          element={
            <ProtectedRouteLayout>
              <CategoriesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.INVENTORY_BRANDS}
          element={
            <ProtectedRouteLayout>
              <BrandsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.INVENTORY_PRODUCTS}
          element={
            <ProtectedRouteLayout>
              <ProductsPage />
            </ProtectedRouteLayout>
          }
        />

        <Route path={ROUTES.INVENTORY_PURCHASES} element={<ProtectedRouteLayout><PurchasesPage /></ProtectedRouteLayout>} />
        <Route path={ROUTES.INVENTORY_TRANSFERS} element={<ProtectedRouteLayout><TransfersPage /></ProtectedRouteLayout>} />

        <Route
          path={ROUTES.INVENTORY_STOCK}
          element={
            <ProtectedRouteLayout>
              <StockPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.DOCUMENT_TypeOfDocument}
          element={
            <ProtectedRouteLayout>
              <TypeOfDocumentsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.DOCUMENT_Receipt}
          element={
            <ProtectedRouteLayout>
              <ReceiptsPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.FINANCE_Currencie}
          element={
            <ProtectedRouteLayout>
              <CurrenciesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_DaysOfCredit}
          element={
            <ProtectedRouteLayout>
              <DaysOfCreditPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_ExchangeRate}
          element={
            <ProtectedRouteLayout>
              <ExchangeRatesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_Taxe}
          element={
            <ProtectedRouteLayout>
              <TaxesPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.FINANCE_Bank}
          element={
            <ProtectedRouteLayout>
              <BanksPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_BankAccount}
          element={
            <ProtectedRouteLayout>
              <BankAccountsPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.FINANCE_PaymentMethod}
          element={
            <ProtectedRouteLayout>
              <PaymentMethodsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_PaymentType}
          element={
            <ProtectedRouteLayout>
              <PaymentTypesPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.FINANCE_CashRegister}
          element={
            <ProtectedRouteLayout>
              <CashRegistersPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_CashRegisterClose}
          element={
            <ProtectedRouteLayout>
              <CashRegisterClosePage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_OpenCashRegister}
          element={
            <ProtectedRouteLayout>
              <OpenCashRegisterPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_CashRegisterSession}
          element={
            <ProtectedRouteLayout>
              <CashRegisterSessionsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_CloseCashRegisterSession}
          element={
            <ProtectedRouteLayout>
              <CloseCashRegisterSessionPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.FINANCE_CashMovement}
          element={
            <ProtectedRouteLayout>
              <CashMovementsPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.ORGANIZATION_CompanY}
          element={
            <ProtectedRouteLayout>
              <CompaniesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.ORGANIZATION_BranchOffice}
          element={
            <ProtectedRouteLayout>
              <BranchOfficesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.ORGANIZATION_Warehouse}
          element={
            <ProtectedRouteLayout>
              <WarehousesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.ORGANIZATION_Store}
          element={
            <ProtectedRouteLayout>
              <StoresPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.BILLING_Plans}
          element={
            <ProtectedRouteLayout>
              <PlansPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_Subscriptions}
          element={
            <ProtectedRouteLayout>
              <SubscriptionsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_Limits}
          element={
            <ProtectedRouteLayout>
              <LimitsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_PlanLimits}
          element={
            <ProtectedRouteLayout>
              <PlanLimitsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_PlanLimitsId}
          element={
            <ProtectedRouteLayout>
              <PlanLimitsPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_Features}
          element={
            <ProtectedRouteLayout>
              <FeaturesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_PlanFeatures}
          element={
            <ProtectedRouteLayout>
              <PlanFeaturesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.BILLING_PlanFeaturesId}
          element={
            <ProtectedRouteLayout>
              <PlanFeaturesPage />
            </ProtectedRouteLayout>
          }
        />

        <Route
          path={ROUTES.ADMINISTRATION_Role}
          element={
            <ProtectedRouteLayout>
              <RolesPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.ADMINISTRATION_User}
          element={
            <ProtectedRouteLayout>
              <UsersPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path={ROUTES.ADMINISTRATION_Status}
          element={
            <ProtectedRouteLayout>
              <StatusesPage />
            </ProtectedRouteLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
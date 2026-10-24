import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSales } from "../hooks/useSales";
import { useDeleteSale } from "../hooks/useDeleteSale";
import { SalesTable } from "../components/SalesTable";
import { SaleFilters } from "../components/SaleFilters";
import { CashRegisterSkeleton } from "@/modules/finance/cash/cash_registers/components/CashRegisterSkeleton";
import { useAuthStore } from "@/app/store/auth.store";
import MuiSvgIcon from "@components/MuiSvgIcon";
import "@styles/sales.scss";
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning";
import { usePatients } from "@/modules/clinical/patients/hooks/usePatients";

// Ejemplo de opciones de estado (puedes obtenerlas de un hook o definirlas aquí)
const SALE_STATUS_OPTIONS = [
  { id: 1, name: "Completada" },
  { id: 2, name: "Pendiente" },
  { id: 3, name: "Cancelada" },
];

export const SalesPage = () => {
  const navigate = useNavigate();
  const { user, getLimitValue, plan, currentCompanyId, isSuperAdmin: userIsSuperAdmin } = useAuthStore();
  const { data: patientsData, isLoading: isLoadingPatients } = usePatients();
  const patients = patientsData?.pages.flatMap((page) => page.results) || [];

  const [maxSales, setMaxSales] = useState<number | null>(null);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  const [limitsLoaded, setLimitsLoaded] = useState(false);
  const limitsLoadAttempted = useRef(false);

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const [patientId, setPatientId] = useState<number | undefined>(undefined);
  const [statusId, setStatusId] = useState<number | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentSalesCount, setCurrentSalesCount] = useState(0);
  const [showWarning, setShowWarning] = useState(true);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useSales({
    search: debouncedSearchTerm || undefined,
    patient_id: patientId,
    sale_status_id: statusId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    company_id: !userIsSuperAdmin ? currentCompanyId : undefined,
  });

  const { mutate: deleteSale } = useDeleteSale();

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return;
      limitsLoadAttempted.current = true;

      try {
        const limitValue = getLimitValue("max_sales");
        setMaxSales(limitValue !== undefined && limitValue !== null ? limitValue : null);
      } catch (error) {
        console.error("Error loading limits:", error);
        setMaxSales(null);
      } finally {
        setIsLoadingLimits(false);
        setLimitsLoaded(true);
      }
    };

    loadLimits();
  }, [getLimitValue]);

  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true;

  const canAddMoreSales = useMemo(() => {
    if (isSuperAdmin) return true;
    if (isLoadingLimits) return false;
    return maxSales === null || currentSalesCount < maxSales;
  }, [isSuperAdmin, isLoadingLimits, maxSales, currentSalesCount]);

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false;
    if (isLoadingLimits || !limitsLoaded) return false;
    if (!showWarning) return false;
    if (maxSales === null) return false;
    if (currentSalesCount === 0) return false;
    return currentSalesCount >= maxSales - 1;
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxSales, currentSalesCount]);

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0;
    if (isLoadingLimits || !limitsLoaded) return 0;
    if (!maxSales || maxSales === 0) return 0;
    return (currentSalesCount / maxSales) * 100;
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentSalesCount, maxSales]);

  const allSales = data?.pages.flatMap((page) => page.results) || [];
  const totalSales = data?.pages[0]?.count || 0;
  const {
    visibleData: paginatedSales,
    page: currentPage,
    pageCount,
    pageSize,
    setPage: setCurrentPage,
    setPageSize,
  } = useModulePagination({
    data: allSales,
    total: totalSales,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count;
      setCurrentSalesCount(newCount);
    }
  }, [data]);

  const handleDelete = (id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta venta?")) {
      deleteSale(id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setPatientId(undefined);
    setStatusId(undefined);
    setDateFrom("");
    setDateTo("");
  }, []);

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  if (isLoading && !data) {
    return <CashRegisterSkeleton />;
  }

  return (
    <div className="sales-page">
      {shouldShowWarning && maxSales !== null && currentSalesCount > 0 && (
        <UserLimitWarning
          maxUsers={maxSales}
          currentCount={currentSalesCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}

      <div className="sales-page__header">
        <div className="sales-page__header-left">
          <h1 className="sales-page__title">
            Ventas
            <span className="sales-page__count">{totalSales}</span>
          </h1>
          {!isSuperAdmin && maxSales !== null && (
            <span className="sales-page__limit-info">
              {currentSalesCount} / {maxSales} utilizadas
            </span>
          )}
        </div>
        <button
          className="add-button"
          onClick={() => navigate("/sales/create")}
          disabled={!canAddMoreSales}
          title={
            !canAddMoreSales && !isSuperAdmin
              ? "Has alcanzado el límite de ventas de tu plan"
              : "Crear nueva venta"
          }
        >
          <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
          Agregar
        </button>
      </div>

      <SaleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        patients={patients}
        isLoadingPatients={isLoadingPatients}
        patientId={patientId}
        onPatientIdChange={setPatientId}
        statusOptions={SALE_STATUS_OPTIONS}
        statusId={statusId}
        onStatusIdChange={setStatusId}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
      />

      <div className="sales-page__content">
        {paginatedSales.length > 0 ? (
          <>
            <SalesTable
              data={paginatedSales}
              onEdit={(sale) => navigate(`/sales/${sale.id}/edit`)}
              onDelete={handleDelete}
              onView={(id) => navigate(`/sales/${id}`)}
            />

            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalSales}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="sales-empty">
            <MuiSvgIcon size={64}>lucide:shopping-cart</MuiSvgIcon>
            <h3>No hay ventas registradas</h3>
            <p>Comienza registrando una nueva venta</p>
            <button
              className="sales-empty__button"
              onClick={() => navigate("/sales/create")}
            >
              Nueva Venta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
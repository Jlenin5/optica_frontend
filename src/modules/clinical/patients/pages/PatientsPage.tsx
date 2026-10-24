import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from "@/components/ui/modal";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { usePatients } from "../hooks/usePatients";
import { useCreatePatient } from "../hooks/useCreatePatient";
import { useUpdatePatient } from "../hooks/useUpdatePatient";
import { PatientTable } from "../components/PatientTable";
import { PatientForm } from "../components/PatientForm";
import { PatientFilters } from "../components/PatientFilters";
import { PatientSkeleton } from "../components/PatientSkeleton";
import type { Patient } from "../types/patients.types";
import { useAuthStore } from "@/app/store/auth.store";
import { UserLimitWarning } from "@/modules/users/components/UserLimitWarning";
import MuiSvgIcon from "@components/MuiSvgIcon";
import "@styles/patients.scss";
import { Button } from "@/components/ui/Button";

export const PatientsPage = () => {
  const {
    user,
    getLimitValue,
    plan,
    currentCompanyId,
    isSuperAdmin: userIsSuperAdmin,
  } = useAuthStore();

  const [maxPatients, setMaxPatients] = useState<number | null>(null);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  const [limitsLoaded, setLimitsLoaded] = useState(false);
  const limitsLoadAttempted = useRef(false);

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350);
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [documentTypeId, setDocumentTypeId] = useState<number | undefined>(
    undefined,
  );
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatientsCount, setCurrentPatientsCount] = useState(0);
  const [showWarning, setShowWarning] = useState(true);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePatients({
    search: debouncedSearch || undefined,
    status,
    document_type_id: documentTypeId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    company_id: currentCompanyId || undefined,
  });

  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return;
      limitsLoadAttempted.current = true;

      try {
        const limitValue = getLimitValue("max_patients");
        setMaxPatients(
          limitValue !== undefined && limitValue !== null ? limitValue : null,
        );
      } catch (error) {
        console.error("Error loading limits:", error);
        setMaxPatients(null);
      } finally {
        setIsLoadingLimits(false);
        setLimitsLoaded(true);
      }
    };

    loadLimits();
  }, [getLimitValue]);

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true;

  const canAddMorePatients = useMemo(() => {
    if (isSuperAdmin) return true;
    if (isLoadingLimits) return false;
    return maxPatients === null || currentPatientsCount < maxPatients;
  }, [
    isSuperAdmin,
    isLoadingLimits,
    maxPatients,
    currentPatientsCount,
  ]);

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false;
    if (isLoadingLimits || !limitsLoaded) return false;
    if (!showWarning) return false;
    if (maxPatients === null) return false;
    if (currentPatientsCount === 0) return false;
    return currentPatientsCount >= maxPatients - 1;
  }, [
    isSuperAdmin,
    isLoadingLimits,
    limitsLoaded,
    showWarning,
    maxPatients,
    currentPatientsCount,
  ]);

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0;
    if (isLoadingLimits || !limitsLoaded) return 0;
    if (!maxPatients || maxPatients === 0) return 0;
    return (currentPatientsCount / maxPatients) * 100;
  }, [
    isSuperAdmin,
    isLoadingLimits,
    limitsLoaded,
    currentPatientsCount,
    maxPatients,
  ]);

  const allPatients = data?.pages.flatMap((page) => page.results) || [];
  const totalPatients = data?.pages[0]?.count || 0;
  const { visibleData: paginatedPatients, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allPatients, total: totalPatients, fetchNextPage, hasNextPage, isFetchingNextPage,
  });

  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count;
      setCurrentPatientsCount(newCount);
    }
  }, [data]);

  const handleSubmit = useCallback(
    (patientData: Partial<Patient>) => {
      if (selectedPatient) {
        updatePatient(
          { id: selectedPatient.id, data: patientData },
          {
            onSuccess: () => {
              setIsModalOpen(false);
              setSelectedPatient(null);
            },
          },
        );
      } else {
        createPatient(patientData as any, {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        });
      }
    },
    [selectedPatient, updatePatient, createPatient],
  );

  const handleEdit = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatus(undefined);
    setDocumentTypeId(undefined);
    setDateFrom("");
    setDateTo("");
  }, []);

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  if (isLoading && !data) {
    return <PatientSkeleton />;
  }

  return (
    <div className="patients-page">
      {shouldShowWarning &&
        maxPatients !== null &&
        currentPatientsCount > 0 && (
          <UserLimitWarning
            maxUsers={maxPatients}
            currentCount={currentPatientsCount}
            usagePercentage={getUsagePercentage}
            planName={plan?.name}
            isSuperAdmin={isSuperAdmin}
            onClose={handleCloseWarning}
          />
        )}

      <div className="patients-page__header">
        <div className="patients-page__header-left">
          <h1 className="patients-page__title">Pacientes</h1>
        </div>
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={!canAddMorePatients}
        >
          <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
          Agregar
          {!canAddMorePatients && !isSuperAdmin && (
            <span className="patients-page__add-badge">Límite alcanzado</span>
          )}
        </button>
      </div>

      <PatientFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        documentTypeId={documentTypeId}
        onDocumentTypeIdChange={setDocumentTypeId}
        onClearFilters={handleClearFilters}
      />

      {/* Patients Table */}
      <div className="patients-page__content">
        {allPatients.length > 0 ? (
          <>
            <PatientTable
              data={paginatedPatients}
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />

            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalPatients}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />

          </>
        ) : (
          <div className="patients-empty">
            <svg
              className="patients-empty__icon"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M4 4L20 20M20 4L4 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h3>No hay pacientes registrados</h3>
            <p>Comienza creando un nuevo paciente en el sistema</p>
            <button className="patients-empty__button" onClick={handleAdd}>
              Crear Paciente
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedPatient ? "Editar Paciente" : "Nuevo Paciente"}
          onClose={handleCloseModal}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" form="patient-form" isLoading={isCreating || isUpdating}>
                Guardar
              </Button>
            </>
          }
        >
          <PatientForm
            onSubmit={handleSubmit}
            initialData={selectedPatient}
          />
        </AppModal>
      )}
    </div>
  );
};
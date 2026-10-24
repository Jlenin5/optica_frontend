import React, { useMemo } from "react";
import MuiSvgIcon from "@components/MuiSvgIcon";
import type { Patient } from "@/modules/clinical/patients/types/patients.types";

interface StatusOption {
  id: number;
  name: string;
}

interface SaleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  patients: Patient[] | [];
  isLoadingPatients?: boolean;
  patientId?: number;
  onPatientIdChange: (value: number | undefined) => void;
  statusOptions?: StatusOption[];
  statusId?: number;
  onStatusIdChange: (value: number | undefined) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SaleFilters: React.FC<SaleFiltersProps> = React.memo(({
  searchTerm,
  onSearchChange,
  patients,
  isLoadingPatients = false,
  patientId,
  onPatientIdChange,
  statusOptions = [],
  statusId,
  onStatusIdChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters
}) => {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  const patientSelectContent = useMemo(() => {
    if (isLoadingPatients) {
      return <option value="">Cargando clientes...</option>;
    }
    if (patients.length === 0) {
      return <option value="">No hay clientes disponibles</option>;
    }
    return patients.map((patient) => (
      <option key={patient?.id} value={patient?.id}>
        {patient?.first_name} {patient?.last_name || ""}
      </option>
    ));
  }, [isLoadingPatients, patients]);

  return (
    <div className="sale-filters">
      <div className="sale-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por número de venta, cliente o documento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sale-filters__search-input"
          aria-label="Buscar ventas"
        />
        {searchTerm && (
          <button
            className="sale-filters__search-clear"
            onClick={handleClearSearch}
            aria-label="Limpiar búsqueda"
          >
            <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
          </button>
        )}
      </div>

      <div className="sale-filters__grid">
        <div className="sale-filters__field">
          <label className="sale-filters__label" htmlFor="patient-select">
            Cliente
          </label>
          <select
            id="patient-select"
            value={patientId || ""}
            onChange={(e) => onPatientIdChange(e.target.value ? Number(e.target.value) : undefined)}
            className="sale-filters__select"
            disabled={isLoadingPatients}
          >
            <option value="">Todos los clientes</option>
            {patientSelectContent}
          </select>
        </div>

        <div className="sale-filters__field">
          <label className="sale-filters__label" htmlFor="status-select">
            Estado
          </label>
          <select
            id="status-select"
            value={statusId || ""}
            onChange={(e) => onStatusIdChange(e.target.value ? Number(e.target.value) : undefined)}
            className="sale-filters__select"
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sale-filters__field">
          <label className="sale-filters__label" htmlFor="date-from">
            Fecha desde
          </label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="sale-filters__date"
            aria-label="Fecha desde"
          />
        </div>

        <div className="sale-filters__field">
          <label className="sale-filters__label" htmlFor="date-to">
            Fecha hasta
          </label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="sale-filters__date"
            aria-label="Fecha hasta"
          />
        </div>
      </div>

      <div className="sale-filters__actions">
        <button onClick={onClearFilters} className="sale-filters__clear-btn" aria-label="Limpiar todos los filtros">
          <MuiSvgIcon size={16}>lucide:eraser</MuiSvgIcon>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
});

SaleFilters.displayName = "SaleFilters";
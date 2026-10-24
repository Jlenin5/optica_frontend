import { useDebounce } from "@/hooks/useDebounce"
import { useState } from "react";
import { useConsultations } from "../hooks/useConsultations";
import { ConsultationList } from "../components/ConsultationList";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import "@styles/clinical-evaluations.scss";

export const ConsultationsPage = () => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350);
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data,
    isLoading,
  } = useConsultations({ search: debouncedSearch, status: statusFilter || undefined });

  const evaluations = data?.pages.flatMap(page => page.results) || [];

  return (
    <div className="evaluations-page">
      {/* Header */}
      <div className="evaluations-page__header">
        <div>
          <h1 className="evaluations-page__title">Consultas Clínicas</h1>
          <p className="evaluations-page__subtitle">
            Historial de consultas realizadas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="evaluations-page__filters">
        <div className="evaluations-page__search">
          <MuiSvgIcon size={18}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por paciente, diagnóstico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="evaluations-page__status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {/* Lista */}
      <div className="evaluations-page__content">
        <ConsultationList
          evaluations={evaluations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

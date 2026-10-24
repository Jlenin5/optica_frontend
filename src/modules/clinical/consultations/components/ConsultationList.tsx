import { useNavigate } from "react-router-dom";
import type { Consultation } from "../types/consultations.types";
import { CONSULTATION_STATUS_LABELS, CONSULTATION_STATUS_BADGE_CLASS } from "../types/consultations.types";
import MuiSvgIcon from "@/components/MuiSvgIcon";

interface ConsultationListProps {
  evaluations: Consultation[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
}

const getStatusBadgeClass = (status: string) => {
  return CONSULTATION_STATUS_BADGE_CLASS[status] || '';
};

export const ConsultationList = ({ evaluations, isLoading, onDelete }: ConsultationListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="evaluation-list__loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="evaluation-card-skeleton">
            <div className="skeleton skeleton--title"></div>
            <div className="skeleton skeleton--text"></div>
            <div className="skeleton skeleton--text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!evaluations.length) {
    return (
      <div className="evaluation-list__empty">
        <MuiSvgIcon size={48}>lucide:clipboard-list</MuiSvgIcon>
        <h3>No hay consultas clínicas</h3>
        <p>Las consultas clínicas se crean desde una cita</p>
      </div>
    );
  }

  return (
    <div className="evaluation-list">
      {evaluations.map((evaluation) => (
        <div
          key={evaluation.id}
          className="evaluation-card"
          onClick={() => navigate(`/consultations/${evaluation.id}`)}
        >
          <div className="evaluation-card__header">
            <div className="evaluation-card__patient-info">
              <div className="evaluation-card__avatar">
                {evaluation.patient_name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <div>
                <h4 className="evaluation-card__patient-name">
                  {evaluation.patient_name || 'Paciente'}
                </h4>
                {evaluation.patient_document && (
                  <span className="evaluation-card__patient-doc">
                    {evaluation.patient_document}
                  </span>
                )}
              </div>
            </div>
            <span className={`status-badge ${getStatusBadgeClass(evaluation.status)}`}>
              {CONSULTATION_STATUS_LABELS[evaluation.status] || evaluation.status}
            </span>
          </div>

          <div className="evaluation-card__body">
            {evaluation.chief_complaint && (
              <div className="evaluation-card__field">
                <MuiSvgIcon size={14}>lucide:message-square</MuiSvgIcon>
                <span>{evaluation.chief_complaint}</span>
              </div>
            )}
            {evaluation.diagnosis && (
              <div className="evaluation-card__field">
                <MuiSvgIcon size={14}>lucide:activity</MuiSvgIcon>
                <span>{evaluation.diagnosis}</span>
              </div>
            )}
          </div>

          <div className="evaluation-card__footer">
            <div className="evaluation-card__meta">
              {evaluation.appointment_date && (
                <span>
                  <MuiSvgIcon size={14}>lucide:calendar</MuiSvgIcon>
                  {/* {formatDate(evaluation.appointment_date)} */}
                </span>
              )}
              {evaluation.optometrist_name && (
                <span>
                  <MuiSvgIcon size={14}>lucide:user</MuiSvgIcon>
                  {evaluation.optometrist_name}
                </span>
              )}
              {evaluation.prescription && (
                <span title="Ya tiene prescripción generada">
                  <MuiSvgIcon size={14}>lucide:file-check</MuiSvgIcon>
                  Con prescripción
                </span>
              )}
            </div>
            <div className="evaluation-card__actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="evaluation-card__action-btn"
                onClick={() => navigate(`/consultations/${evaluation.id}`)}
                title="Editar"
              >
                <MuiSvgIcon size={16}>lucide:pencil</MuiSvgIcon>
              </button>
              {onDelete && (
                <button
                  className="evaluation-card__action-btn evaluation-card__action-btn--delete"
                  onClick={() => onDelete(evaluation.id)}
                  title="Eliminar"
                >
                  <MuiSvgIcon size={16}>lucide:trash-2</MuiSvgIcon>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

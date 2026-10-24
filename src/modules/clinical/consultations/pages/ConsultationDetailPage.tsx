import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConsultation } from "../hooks/useConsultation";
import { useUpdateConsultation } from "../hooks/useUpdateConsultation";
import { useChangeConsultationStatus } from "../hooks/useChangeConsultationStatus";
import { useDeleteConsultation } from "../hooks/useDeleteConsultation";
import { ConsultationDetail } from "../components/ConsultationDetail";
import { ConsultationForm } from "../components/ConsultationForm";
import { ConsultationSkeleton } from "../components/ConsultationSkeleton";
import {
  CONSULTATION_STATUS,
  CONSULTATION_STATUS_LABELS,
  CONSULTATION_STATUS_BADGE_CLASS
} from "../types/consultations.types";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import "@styles/clinical-evaluations.scss";

export const ConsultationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const { data: evaluation, isLoading } = useConsultation(Number(id));
  const { mutate: updateEvaluation, isPending: isUpdating } = useUpdateConsultation();
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeConsultationStatus();
  const { mutate: deleteEvaluation, isPending: isDeleting } = useDeleteConsultation();

  const {
    isOpen: isDeleteDialogOpen,
    open: openDeleteDialog,
    close: closeDeleteDialog,
    confirm: confirmDeleteDialog
  } = useConfirmDialog();

  const isDraft = evaluation?.status === CONSULTATION_STATUS.DRAFT;
  const isCompleted = evaluation?.status === CONSULTATION_STATUS.COMPLETED;
  const isCancelled = evaluation?.status === CONSULTATION_STATUS.CANCELLED;

  const handleUpdate = (data: any) => {
    updateEvaluation(
      { id: Number(id), data },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  // Cambia el estado de la consulta. Este es el paso que "desbloquea" la
  // creación de la prescripción: solo una consulta con status = 'completed'
  // puede generar su Prescription (relación Consultation 1:1 Prescription).
  const handleChangeStatus = (status: string) => {
    changeStatus({ id: Number(id), status });
  };

  const handleDelete = () => {
    openDeleteDialog({
      title: "Eliminar Consulta Clínica",
      message: "¿Está seguro de que desea eliminar esta consulta clínica? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      variant: "danger",
      onConfirm: () => {
        deleteEvaluation(Number(id), {
          onSuccess: () => {
            navigate("/consultations");
          }
        });
      }
    });
  };

  const handleCreatePrescription = () => {
    if (!evaluation) return;
    // Prescription 1:1 Consultation: se crea vinculada directamente a esta consulta.
    navigate(`/consultations/${evaluation.id}/prescription`);
  };

  const handleCreateSale = () => {
    if (!evaluation || evaluation.status !== CONSULTATION_STATUS.COMPLETED) return;
    const patientId = evaluation.medical_record?.patient_id || evaluation.medical_record?.patient?.id;
    if (!patientId) return;
    const appointmentId = evaluation.appointment_id;
    const query = new URLSearchParams({ patient_id: String(patientId) });
    if (appointmentId) query.set("appointment_id", String(appointmentId));
    navigate(`/sales/create?${query.toString()}`);
  };

  if (isLoading) {
    return <ConsultationSkeleton />;
  }

  if (!evaluation) {
    return (
      <div className="evaluation-error">
        <div className="evaluation-error__content">
          <MuiSvgIcon size={48}>lucide:alert-circle</MuiSvgIcon>
          <h2>Consulta no encontrada</h2>
          <button onClick={() => navigate('/consultations')}>
            Volver a Consultas
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="evaluation-page">
        <div className="evaluation-page__header">
          <button
            className="evaluation-page__back-btn"
            onClick={() => setIsEditing(false)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div>
            <h1 className="evaluation-page__title">Editar Consulta Clínica</h1>
          </div>
        </div>
        <div className="evaluation-page__content">
          <ConsultationForm
            initialData={evaluation}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isUpdating}
            medicalRecordId={evaluation.medical_record_id}
            appointmentId={evaluation.appointment_id}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="evaluation-detail-page">
      {/* Header */}
      <div className="evaluation-detail-page__header">
        <div>
          <div className="evaluation-detail-page__title-row">
            <h1 className="evaluation-detail-page__title">Consulta Clínica</h1>
            <span className={`status-badge ${CONSULTATION_STATUS_BADGE_CLASS[evaluation.status] || ''}`}>
              {CONSULTATION_STATUS_LABELS[evaluation.status] || evaluation.status}
            </span>
          </div>
          <p className="evaluation-detail-page__subtitle">
            ID: #{evaluation.id}
          </p>
        </div>
        <div className="evaluation-detail-page__header-actions">
          {/* Solo se puede editar el contenido clínico mientras está en Borrador.
              Una vez Completada o Cancelada, queda como registro fijo. */}
          {isDraft && (
            <button
              className="evaluation-detail-page__action-btn evaluation-detail-page__action-btn--edit"
              onClick={() => setIsEditing(true)}
            >
              <MuiSvgIcon size={18}>lucide:pencil</MuiSvgIcon>
              Editar
            </button>
          )}
          <button
            className="evaluation-detail-page__action-btn evaluation-detail-page__action-btn--delete"
            onClick={handleDelete}
          >
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
            Eliminar
          </button>
        </div>
      </div>

      {/* Flujo de estado de la consulta */}
      <div className="evaluation-detail-page__content" style={{ marginBottom: '1rem' }}>
        {isDraft && (
          <div className="evaluation-status-flow">
            <p>
              <MuiSvgIcon size={16}>lucide:info</MuiSvgIcon>
              Esta consulta está en <strong>Borrador</strong>. Completa el examen clínico y
              finalízala para poder generar la prescripción.
            </p>
            <div className="evaluation-status-flow__actions">
              <button
                className="evaluation-status-flow__btn evaluation-status-flow__btn--complete"
                onClick={() => handleChangeStatus(CONSULTATION_STATUS.COMPLETED)}
                disabled={isChangingStatus}
              >
                <MuiSvgIcon size={16}>lucide:check-circle</MuiSvgIcon>
                Finalizar Consulta
              </button>
              <button
                className="evaluation-status-flow__btn evaluation-status-flow__btn--cancel"
                onClick={() => handleChangeStatus(CONSULTATION_STATUS.CANCELLED)}
                disabled={isChangingStatus}
              >
                <MuiSvgIcon size={16}>lucide:x-circle</MuiSvgIcon>
                Cancelar Consulta
              </button>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="evaluation-status-flow evaluation-status-flow--cancelled">
            <p>
              <MuiSvgIcon size={16}>lucide:x-circle</MuiSvgIcon>
              Esta consulta fue cancelada. No se puede generar una prescripción para ella.
            </p>
          </div>
        )}

        {isCompleted && !evaluation.prescription && (
          <div className="evaluation-status-flow">
            <p>
              <MuiSvgIcon size={16}>lucide:check-circle</MuiSvgIcon>
              Esta consulta está <strong>Completada</strong> y lista para generar su prescripción.
              Si fue finalizada por error, puedes reabrirla para seguir editándola.
            </p>
            <div className="evaluation-status-flow__actions">
              <button
                className="evaluation-status-flow__btn evaluation-status-flow__btn--cancel"
                onClick={() => handleChangeStatus(CONSULTATION_STATUS.DRAFT)}
                disabled={isChangingStatus}
              >
                <MuiSvgIcon size={16}>lucide:rotate-ccw</MuiSvgIcon>
                Reabrir Consulta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="evaluation-detail-page__content">
        <ConsultationDetail evaluation={evaluation} />

        {/* Acciones adicionales: la prescripción solo puede crearse cuando la
            consulta está Completada (Consultation 1:1 Prescription). */}
        {isCompleted && !evaluation.prescription && (
          <div className="evaluation-detail-page__additional-actions">
            <button
              className="evaluation-detail-page__prescription-btn"
              onClick={handleCreatePrescription}
            >
              <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
              Crear Prescripción
            </button>
          </div>
        )}

        {/* Una vez generada la prescripción, el siguiente paso del proceso es
            registrar la venta de los lentes con esa fórmula. */}
        {evaluation.prescription && (
          <div className="evaluation-detail-page__additional-actions">
            <button
              className="evaluation-detail-page__prescription-btn"
              onClick={() => navigate(`/consultations/${evaluation.id}/prescription`)}
            >
              <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
              Ver Prescripción
            </button>
            <button
              className="evaluation-detail-page__prescription-btn evaluation-detail-page__prescription-btn--secondary"
              onClick={handleCreateSale}
            >
              <MuiSvgIcon size={20}>lucide:shopping-cart</MuiSvgIcon>
              Registrar Venta
            </button>
          </div>
        )}
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteDialog}
        title="Eliminar Consulta Clínica"
        message="¿Está seguro de que desea eliminar esta consulta clínica? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

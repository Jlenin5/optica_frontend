import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCreateConsultation } from "../hooks/useCreateConsultation";
import { useAppointment } from "@/modules/clinical/appointments/hooks/useAppointment";
import { useMedicalRecordByPatient } from "@/modules/clinical/medical_records/hooks/useMedicalRecordByPatient";
import { useCreateMedicalRecord } from "@/modules/clinical/medical_records/hooks/useCreateMedicalRecord";
import { ConsultationForm } from "../components/ConsultationForm";
import { ConsultationSkeleton } from "../components/ConsultationSkeleton";
import MuiSvgIcon from "@/components/MuiSvgIcon";
import "@styles/clinical-evaluations.scss";

export const CreateConsultationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener parámetros de URL o query params
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const searchParams = new URLSearchParams(location.search);
  const appointmentIdFromQuery = searchParams.get('appointment_id');

  const effectiveAppointmentId = appointmentId || appointmentIdFromQuery;

  const { mutate: createConsultation, isPending } = useCreateConsultation();
  const { mutate: createMedicalRecord } = useCreateMedicalRecord();
  const { data: appointment, isLoading } = useAppointment(
    Number(effectiveAppointmentId),
  );

  const patientId = appointment?.patient?.id || appointment?.patient_id;
  const { data: medicalRecord, isLoading: isLoadingRecord } = useMedicalRecordByPatient(
    Number(patientId),
    { enabled: !!patientId }
  );

  const handleSubmit = (data: any) => {
    // El paciente debe tener un historial clínico antes de registrar la consulta
    // (Patient 1:1 MedicalRecord). Si no existe, se crea automáticamente.
    const proceed = (medicalRecordId: number) => {
      const consultationData = {
        ...data,
        medical_record_id: medicalRecordId,
        appointment: Number(effectiveAppointmentId),
        optometrist: appointment?.optometrist?.id || null
      };

      createConsultation(consultationData, {
        onSuccess: () => {
          if (appointmentId) {
            navigate(`/appointments/${appointmentId}`);
          }
        }
      });
    };

    if (medicalRecord) {
      proceed(medicalRecord.id);
    } else if (patientId) {
      createMedicalRecord({ patient_id: Number(patientId) }, {
        onSuccess: (record) => proceed(record.id)
      });
    }
  };

  if (isLoading || isLoadingRecord) {
    return <ConsultationSkeleton />;
  }

  if (!appointment && effectiveAppointmentId) {
    return (
      <div className="evaluation-error">
        <div className="evaluation-error__content">
          <MuiSvgIcon size={48}>lucide:alert-circle</MuiSvgIcon>
          <h2>Cita no encontrada</h2>
          <p>La cita especificada no existe o ha sido eliminada</p>
          <button
            className="evaluation-error__btn"
            onClick={() => navigate('/appointments')}
          >
            Volver a Citas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="evaluation-page">
      {/* Header */}
      <div className="evaluation-page__header">
        <button
          className="evaluation-page__back-btn"
          onClick={() => {
            if (appointmentId) {
              navigate(`/appointments/${appointmentId}`);
            } else {
              navigate('/appointments');
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="evaluation-page__title">Nueva Consulta Clínica</h1>
          <p className="evaluation-page__subtitle">
            {appointment && (
              <>
                Cita: {appointment.date} {appointment.time} |
                Paciente: {appointment.patient?.first_name} {appointment.patient?.last_name}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="evaluation-page__content">
        <ConsultationForm
          onSubmit={handleSubmit}
          onCancel={() => {
            if (appointmentId) {
              navigate(`/appointments/${appointmentId}`);
            } else {
              navigate('/appointments');
            }
          }}
          isSubmitting={isPending}
          appointmentId={Number(effectiveAppointmentId)}
          medicalRecordId={medicalRecord?.id || 0}
          optometristId={0}
        />
      </div>
    </div>
  );
};

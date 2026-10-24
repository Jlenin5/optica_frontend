import type { Consultation } from "../types/consultations.types";
import MuiSvgIcon from "@/components/MuiSvgIcon";

interface ConsultationDetailProps {
  evaluation: Consultation;
}

export const ConsultationDetail = ({ evaluation }: ConsultationDetailProps) => {
  // Función helper para obtener el nombre del paciente (a través de MedicalRecord -> Patient)
  const getPatientName = () => {
    const patient = evaluation.medical_record?.patient;
    if (patient) {
      return `${patient.first_name} ${patient.last_name}`;
    }
    return evaluation.patient_name || 'No especificado';
  };

  // Función helper para obtener el documento del paciente
  const getPatientDocument = () => {
    const patient = evaluation.medical_record?.patient;
    if (patient) {
      return patient.document_number;
    }
    return evaluation.patient_document || null;
  };

  // Función helper para obtener la fecha de la cita
  const getAppointmentDate = () => {
    if (typeof evaluation.appointment === 'object' && evaluation.appointment) {
      return evaluation.appointment.date;
    }
    return evaluation.appointment_date || null;
  };

  // Función helper para obtener el nombre del optometrista
  const getOptometristName = () => {
    if (typeof evaluation.optometrist === 'object' && evaluation.optometrist) {
      // return evaluation.optometrist.username || evaluation.optometrist_name;
    }
    return evaluation.optometrist_name || 'No asignado';
  };

  const patientName = getPatientName();
  const patientInitials = patientName
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <div className="evaluation-detail">
      {/* Información del Paciente y Cita */}
      <div className="evaluation-detail__section">
        <h3 className="evaluation-detail__section-title">
          <MuiSvgIcon size={18}>lucide:user</MuiSvgIcon>
          Información General
        </h3>

        <div className="evaluation-detail__grid">
          {/* Paciente */}
          <div className="evaluation-detail__info-card">
            <div className="evaluation-detail__info-avatar">
              {patientInitials}
            </div>
            <div className="evaluation-detail__info-content">
              <h4>{patientName}</h4>
              {getPatientDocument() && (
                <span>Doc: {getPatientDocument()}</span>
              )}
            </div>
          </div>

          {/* Cita */}
          {getAppointmentDate() && (
            <div className="evaluation-detail__field">
              <label>Fecha de Cita</label>
              {/* <p>{formatDate(getAppointmentDate()!)}</p> */}
            </div>
          )}

          {/* Optometrista */}
          <div className="evaluation-detail__field">
            <label>Optometrista</label>
            <p>{getOptometristName()}</p>
          </div>
        </div>
      </div>

      {/* Motivo de Consulta */}
      <div className="evaluation-detail__section">
        <h3 className="evaluation-detail__section-title">
          <MuiSvgIcon size={18}>lucide:stethoscope</MuiSvgIcon>
          Motivo de Consulta
        </h3>
        <div className={`evaluation-detail__field ${!evaluation.chief_complaint ? 'evaluation-detail__field--empty' : ''}`}>
          <p>{evaluation.chief_complaint || 'No especificado'}</p>
        </div>
      </div>

      {/* Agudeza Visual */}
      <div className="evaluation-detail__section">
        <h3 className="evaluation-detail__section-title">
          <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
          Agudeza Visual
        </h3>
        <div className="evaluation-detail__grid">
          <div className={`evaluation-detail__field ${!evaluation.visual_acuity_od ? 'evaluation-detail__field--empty' : ''}`}>
            <label>OD (Ojo Derecho)</label>
            <p>{evaluation.visual_acuity_od || 'No registrado'}</p>
          </div>
          <div className={`evaluation-detail__field ${!evaluation.visual_acuity_oi ? 'evaluation-detail__field--empty' : ''}`}>
            <label>OI (Ojo Izquierdo)</label>
            <p>{evaluation.visual_acuity_oi || 'No registrado'}</p>
          </div>
        </div>
      </div>

      {/* Presión Intraocular */}
      <div className="evaluation-detail__section">
        <h3 className="evaluation-detail__section-title">
          <MuiSvgIcon size={18}>lucide:gauge</MuiSvgIcon>
          Presión Intraocular (mmHg)
        </h3>
        <div className="evaluation-detail__grid">
          <div className={`evaluation-detail__field ${!evaluation.intraocular_pressure_od ? 'evaluation-detail__field--empty' : ''}`}>
            <label>OD (Ojo Derecho)</label>
            <p>{evaluation.intraocular_pressure_od || 'No registrado'}</p>
          </div>
          <div className={`evaluation-detail__field ${!evaluation.intraocular_pressure_oi ? 'evaluation-detail__field--empty' : ''}`}>
            <label>OI (Ojo Izquierdo)</label>
            <p>{evaluation.intraocular_pressure_oi || 'No registrado'}</p>
          </div>
        </div>
      </div>

      {/* Diagnóstico */}
      <div className="evaluation-detail__section">
        <h3 className="evaluation-detail__section-title">
          <MuiSvgIcon size={18}>lucide:activity</MuiSvgIcon>
          Diagnóstico
        </h3>
        <div className={`evaluation-detail__field ${!evaluation.diagnosis ? 'evaluation-detail__field--empty' : ''}`}>
          <p>{evaluation.diagnosis || 'No especificado'}</p>
        </div>
      </div>

      {/* Observaciones */}
      {evaluation.observations && (
        <div className="evaluation-detail__section">
          <h3 className="evaluation-detail__section-title">
            <MuiSvgIcon size={18}>lucide:file-text</MuiSvgIcon>
            Observaciones
          </h3>
          <div className="evaluation-detail__field">
            <p>{evaluation.observations}</p>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {evaluation.recommendations && (
        <div className="evaluation-detail__section">
          <h3 className="evaluation-detail__section-title">
            <MuiSvgIcon size={18}>lucide:lightbulb</MuiSvgIcon>
            Recomendaciones
          </h3>
          <div className="evaluation-detail__field">
            <p>{evaluation.recommendations}</p>
          </div>
        </div>
      )}

      {/* Metadatos */}
      <div className="evaluation-detail__section">
        <h3 className="evaluation-detail__section-title">
          <MuiSvgIcon size={18}>lucide:info</MuiSvgIcon>
          Información del Registro
        </h3>
        <div className="evaluation-detail__grid">
          {evaluation.created_by_name && (
            <div className="evaluation-detail__field">
              <label>Creado por</label>
              <p>{evaluation.created_by_name}</p>
            </div>
          )}
          {evaluation.created_at && (
            <div className="evaluation-detail__field">
              <label>Fecha de Creación</label>
              {/* <p>{formatDateTime(evaluation.created_at)}</p> */}
            </div>
          )}
          {evaluation.updated_by_name && (
            <div className="evaluation-detail__field">
              <label>Última Modificación por</label>
              <p>{evaluation.updated_by_name}</p>
            </div>
          )}
          {evaluation.updated_at && evaluation.updated_at !== evaluation.created_at && (
            <div className="evaluation-detail__field">
              <label>Fecha de Modificación</label>
              {/* <p>{formatDateTime(evaluation.updated_at)}</p> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

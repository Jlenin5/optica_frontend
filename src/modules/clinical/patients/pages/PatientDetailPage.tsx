import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePatient } from "../hooks/usePatient"
import { usePatientPrescriptions } from "@/modules/clinical/prescriptions/hooks/usePatientPrescriptions"
import { usePatientAppointments } from "@appointments/hooks/usePatientAppointments"
import { PrescriptionList } from "@prescriptions/components/PrescriptionList"
import { PatientAppointmentsList } from "@appointments/components/PatientAppointmentsList"
import { PatientSkeleton } from "../components/PatientSkeleton"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/patient-detail.scss"

export const PatientDetailPage = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'info' | 'prescriptions' | 'appointments'>('info')
  
  const { data: patient, isLoading: patientLoading } = usePatient(Number(patientId))
  const { data: prescriptionsData } = usePatientPrescriptions(Number(patientId))
  const { data: appointmentsData, isLoading: appointmentsLoading } = usePatientAppointments(Number(patientId))
  
  const prescriptions = prescriptionsData
  const appointments = appointmentsData?.results || []

  const handleViewPrescription = (prescription: any) => {
    if (prescription.consultation_id) {
      navigate(`/consultations/${prescription.consultation_id}`)
    }
  }

  const handleViewAppointment = (appointment: any) => {
    navigate(`/appointments/${appointment.id}`)
  }

  const handleOpenMedicalRecord = () => {
    navigate(`/patients/${patientId}/medical-record`)
  }

  const handleNewAppointment = () => {
    navigate(`/appointments/new?patient_id=${patientId}`)
  }

  if (patientLoading) {
    return <PatientSkeleton />
  }

  if (!patient) {
    return (
      <div className="patient-detail-error">
        <div className="patient-detail-error__content">
          <h2>Paciente no encontrado</h2>
          <button onClick={() => navigate('/patients')}>Volver a Pacientes</button>
        </div>
      </div>
    )
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'No registrada'
    return new Date(date).toLocaleDateString('es-PE')
  }

  return (
    <div className="patient-detail-page">
      <div className="patient-detail-page__header">
        <button 
          className="patient-detail-page__back-btn"
          onClick={() => navigate('/patients')}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        
        <div className="patient-detail-page__avatar">
          {patient.first_name?.charAt(0).toUpperCase()}
          {patient.last_name?.charAt(0).toUpperCase()}
        </div>
        
        <div className="patient-detail-page__info">
          <h1>{patient.first_name} {patient.last_name}</h1>
          <div className="patient-detail-page__meta">
            <span className="patient-detail-page__meta-item">
              <MuiSvgIcon size={16}>lucide:credit-card</MuiSvgIcon>
              {patient.document_number}
            </span>
            <span className="patient-detail-page__meta-item">
              <MuiSvgIcon size={16}>lucide:phone</MuiSvgIcon>
              {patient.phone || 'No registrado'}
            </span>
            <span className="patient-detail-page__meta-item">
              <MuiSvgIcon size={16}>lucide:mail</MuiSvgIcon>
              {patient.email || 'No registrado'}
            </span>
            <span className="patient-detail-page__meta-item">
              <MuiSvgIcon size={16}>lucide:cake</MuiSvgIcon>
              {formatDate(patient.birth_date)}
            </span>
          </div>
        </div>

        <button
          className="patient-detail-page__back-btn"
          onClick={() => navigate(`/patients/${patientId}/medical-record`)}
          title="Historial Clínico"
        >
          <MuiSvgIcon size={20}>lucide:heart-pulse</MuiSvgIcon>
        </button>
      </div>

      <div className="patient-detail-page__tabs">
        <button 
          className={`patient-detail-page__tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Información General
        </button>
        <button 
          className={`patient-detail-page__tab ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          Recetas Médicas
          {prescriptions && prescriptions.length > 0 && (
            <span className="patient-detail-page__badge">{prescriptions.length}</span>
          )}
        </button>
        <button 
          className={`patient-detail-page__tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Historial de Citas
          {appointments && appointments.length > 0 && (
            <span className="patient-detail-page__badge">{appointments.length}</span>
          )}
        </button>
      </div>

      <div className="patient-detail-page__content">
        {activeTab === 'info' && (
          <div className="patient-detail-page__info-section">
            <div className="info-card">
              <h3>Información Personal</h3>
              <div className="info-card__grid">
                <div className="info-card__item">
                  <label>Nombres completos</label>
                  <p>{patient.first_name} {patient.last_name}</p>
                </div>
                <div className="info-card__item">
                  <label>Tipo de Documento</label>
                  <p>{patient.document_type?.description || 'DNI'}</p>
                </div>
                <div className="info-card__item">
                  <label>Número de Documento</label>
                  <p>{patient.document_number}</p>
                </div>
                <div className="info-card__item">
                  <label>Teléfono</label>
                  <p>{patient.phone || 'No registrado'}</p>
                </div>
                <div className="info-card__item">
                  <label>Email</label>
                  <p>{patient.email || 'No registrado'}</p>
                </div>
                <div className="info-card__item">
                  <label>Fecha de Nacimiento</label>
                  <p>{formatDate(patient.birth_date)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="patient-detail-page__prescriptions-section">
            <div className="section-header">
              <h3>Historial de Recetas</h3>
              <button 
                className="btn-primary"
                onClick={handleOpenMedicalRecord}
              >
                <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
                Ver Historial Clínico
              </button>
            </div>
            
            <PrescriptionList 
              prescriptions={prescriptions || []}
              onView={handleViewPrescription}
            />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="patient-detail-page__appointments-section">
            <div className="section-header">
              <h3>Historial de Citas</h3>
              <button 
                className="btn-primary"
                onClick={handleNewAppointment}
              >
                <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
                Agregar
              </button>
            </div>
            
            {appointmentsLoading ? (
              <div className="patient-appointments-loading">
                <div className="spinner"></div>
                <p>Cargando citas...</p>
              </div>
            ) : (
              <PatientAppointmentsList 
                appointments={appointments}
                onView={handleViewAppointment}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
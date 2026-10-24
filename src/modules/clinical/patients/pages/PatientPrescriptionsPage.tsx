import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePatient } from "../hooks/usePatient"
import { usePatientPrescriptions } from "@/modules/clinical/prescriptions/hooks/usePatientPrescriptions"
import { useTogglePrescriptionStatus } from "@/modules/clinical/prescriptions/hooks/useTogglePrescriptionStatus"
import { useDeletePrescription } from "@/modules/clinical/prescriptions/hooks/useDeletePrescription"
import { PrescriptionList } from "@/modules/clinical/prescriptions/components/PrescriptionList"
import { PatientSkeleton } from "../components/PatientSkeleton"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/patient-detail.scss"
import type { Prescription } from "../../prescriptions/types/prescriptions.types"

export const PatientPrescriptionsPage = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  
  const { data: patient, isLoading: patientLoading } = usePatient(Number(patientId))
  const { data: prescriptions, isLoading: prescriptionsLoading, refetch } = usePatientPrescriptions(Number(patientId))
  const { mutate: toggleStatus } = useTogglePrescriptionStatus()
  const { mutate: deletePrescription } = useDeletePrescription()

  const handleViewPrescription = (prescription: any) => {
    if (prescription.consultation_id) {
      navigate(`/consultations/${prescription.consultation_id}`)
    }
  }

  const handleEditPrescription = (prescription: any) => {
    if (prescription.consultation_id) {
      navigate(`/consultations/${prescription.consultation_id}/prescription`)
    }
  }

  const handleNewPrescription = () => {
    // Desde este módulo, una nueva receta independiente del flujo clínico es EXTERNA.
    navigate(`/patients/${patientId}/prescriptions/new`)
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    toggleStatus({ id, status: !currentStatus }, {
      onSuccess: () => refetch()
    })
  }

  const handleDeletePrescription = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
      deletePrescription(id, {
        onSuccess: () => refetch()
      })
    }
  }

  if (patientLoading || prescriptionsLoading) {
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

  return (
    <div className="patient-detail-page">
      <div className="patient-detail-page__header">
        <button 
          className="patient-detail-page__back-btn"
          onClick={() => navigate(`/patients/${patientId}`)}
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
          </div>
        </div>
      </div>

      <div className="patient-prescriptions-page__content">
        <div className="patient-prescriptions-page__header">
          <div className="patient-prescriptions-page__title-section">
            <h2>Recetas Médicas</h2>
            <p className="patient-prescriptions-page__subtitle">
              Historial completo de recetas y prescripciones del paciente
            </p>
          </div>
          <div className="patient-prescriptions-page__actions">
            <div className="patient-prescriptions-page__view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vista cuadrícula"
              >
                <MuiSvgIcon size={18}>lucide:layout-grid</MuiSvgIcon>
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Vista lista"
              >
                <MuiSvgIcon size={18}>lucide:list</MuiSvgIcon>
              </button>
            </div>
            <button 
              className="btn-primary"
              onClick={handleNewPrescription}
            >
              <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
              Nueva Receta Externa
            </button>
          </div>
        </div>

        {prescriptions && prescriptions.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="prescriptions-grid">
              {prescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onView={handleViewPrescription}
                  onEdit={handleEditPrescription}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeletePrescription}
                />
              ))}
            </div>
          ) : (
            <PrescriptionList 
              prescriptions={prescriptions}
              onView={handleViewPrescription}
              onEdit={handleEditPrescription}
            />
          )
        ) : (
          <div className="prescriptions-empty">
            <MuiSvgIcon size={48}>lucide:file-text</MuiSvgIcon>
            <h3>No hay recetas registradas</h3>
            <p>Este paciente aún no tiene recetas médicas</p>
            <button 
              className="btn-primary"
              onClick={handleNewPrescription}
            >
              <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
              Nueva Receta Externa
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente PrescriptionCard para vista grid
interface PrescriptionCardProps {
  prescription: Prescription
  onView: (prescription: any) => void
  onEdit: (prescription: any) => void
  onToggleStatus: (id: number, status: boolean) => void
  onDelete: (id: number) => void
}

const PrescriptionCard = ({ prescription, onView, onEdit, onToggleStatus, onDelete }: PrescriptionCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
      setIsDeleting(true)
      onDelete(prescription.id)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="prescription-card">
      <div className="prescription-card__header">
        <div className="prescription-card__date">
          <MuiSvgIcon size={16}>lucide:calendar</MuiSvgIcon>
          {formatDate(prescription.created_at)}
        </div>
        <div className="prescription-card__badges">
          {prescription.consultation?.appointment && (
            <span className="prescription-card__badge prescription-card__badge--appointment">
              De cita
            </span>
          )}
          <span className={`prescription-card__badge ${prescription.status ? 'prescription-card__badge--active' : 'prescription-card__badge--inactive'}`}>
            {prescription.status ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      <div className="prescription-card__body">
        <div className="prescription-card__eyes">
          <div className="prescription-card__eye">
            <span className="prescription-card__eye-label">OD</span>
            <div className="prescription-card__eye-values">
              <span>Esf: {prescription.sphere_od || 0}</span>
              <span>Cil: {prescription.cylinder_od || 0}</span>
              {prescription.axis_od && <span>Eje: {prescription.axis_od}°</span>}
            </div>
          </div>
          <div className="prescription-card__eye">
            <span className="prescription-card__eye-label">OI</span>
            <div className="prescription-card__eye-values">
              <span>Esf: {prescription.sphere_oi || 0}</span>
              <span>Cil: {prescription.cylinder_oi || 0}</span>
              {prescription.axis_oi && <span>Eje: {prescription.axis_oi}°</span>}
            </div>
          </div>
        </div>
        {prescription.notes && (
          <div className="prescription-card__notes">{prescription.notes}</div>
        )}
      </div>

      <div className="prescription-card__footer">
        <button 
          className="prescription-card__btn prescription-card__btn--view"
          onClick={() => onView(prescription)}
          title="Ver detalles"
        >
          <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
        </button>
        <button 
          className="prescription-card__btn prescription-card__btn--edit"
          onClick={() => onEdit(prescription)}
          title="Editar"
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
        </button>
        <button 
          className={`prescription-card__btn prescription-card__btn--status ${prescription.status ? 'active' : 'inactive'}`}
          onClick={() => onToggleStatus(prescription.id, prescription.status)}
          title={prescription.status ? 'Desactivar' : 'Activar'}
        >
          <MuiSvgIcon size={18}>
            {prescription.status ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
        </button>
        <button 
          className="prescription-card__btn prescription-card__btn--delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Eliminar"
        >
          {isDeleting ? (
            <span className="prescription-card__spinner"></span>
          ) : (
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
          )}
        </button>
      </div>
    </div>
  )
}
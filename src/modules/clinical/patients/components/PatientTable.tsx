import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeletePatient } from "../hooks/useDeletePatient"
import { useTogglePatientStatus } from "../hooks/useTogglePatientStatus"
import type { Patient } from "../types/patients.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PatientTableProps {
  data: Patient[]
  onEdit: (patient: Patient) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatAge = (birthDate: string | null) => {
  if (!birthDate) return '-'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return `${age} años`
}

export const PatientTable = ({ data, onEdit, onRefresh, isSuperAdmin }: PatientTableProps) => {
  const navigate = useNavigate()
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient()
  const { mutate: toggleStatus, isPending: isToggling } = useTogglePatientStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      setDeletingId(id)
      deletePatient(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    setTogglingId(id)
    toggleStatus({ id, status: !currentStatus }, {
      onSuccess: () => {
        onRefresh()
      },
      onSettled: () => {
        setTogglingId(null)
      }
    })
  }

  const handleViewDetails = (patient: Patient) => {
    navigate(`/patients/${patient.id}`)
  }

  const handleViewPrescriptions = (patient: Patient) => {
    navigate(`/patients/${patient.id}/prescriptions`)
  }

  const handleNewPrescription = (patient: Patient) => {
    // Desde el paciente se crea una receta EXTERNA. Las recetas internas nacen
    // exclusivamente desde una consulta clínica.
    navigate(`/patients/${patient.id}/prescriptions/new`)
  }

  const getFullName = (patient: Patient) => {
    return `${patient?.first_name} ${patient?.last_name}`
  }

  return (
    <div className="patient-table-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Documento</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Edad</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((patient) => (
            <tr key={patient?.id}>
              <td className="patient-table__name">
                <div className="patient-table__name-info">
                  <div className="patient-table__avatar">
                    {getFullName(patient).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="patient-table__full-name">
                      {getFullName(patient)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="patient-table__document">
                <div className="patient-table__document-info">
                  <span className="patient-table__document-type">
                    {patient?.document_type?.abbreviation || 'DNI'}
                  </span>
                  <span className="patient-table__document-number">
                    {patient?.document_number}
                  </span>
                </div>
              </td>
              <td className="patient-table__phone">
                {patient?.phone || '-'}
              </td>
              <td className="patient-table__email">
                {patient?.email || '-'}
              </td>
              <td className="patient-table__age">
                {formatAge(patient?.birth_date)}
              </td>
              {
                isSuperAdmin && (
                  <td className="type-of-receipt-table__company">
                    {patient?.company?.name || '-'}
                  </td>
                )
              }
              <td className="patient-table__status">
                <button
                  className={`patient-table__status-badge patient-table__status-badge--${patient?.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(patient?.id, patient?.status)}
                  disabled={isToggling && togglingId === patient?.id}
                >
                  {isToggling && togglingId === patient?.id ? (
                    <span className="patient-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="patient-table__status-dot"></span>
                      {patient?.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
              </td>
              <td className="patient-table__actions">
                {/* Botón Ver Detalle */}
                <button
                  className="patient-table__action-btn patient-table__action-btn--view"
                  onClick={() => handleViewDetails(patient)}
                  title="Ver detalles del paciente"
                >
                  <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
                </button>
                
                {/* Botón Editar */}
                <button
                  className="patient-table__action-btn patient-table__action-btn--edit"
                  onClick={() => onEdit(patient)}
                  title="Editar paciente"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                
                {/* Botón Ver Recetas */}
                <button
                  className="patient-table__action-btn patient-table__action-btn--prescriptions"
                  onClick={() => handleViewPrescriptions(patient)}
                  title="Ver recetas"
                >
                  <MuiSvgIcon size={18}>lucide:file-text</MuiSvgIcon>
                </button>
                
                {/* Botón Historial Clínico: una receta interna se origina en una consulta. */}
                <button
                  className="patient-table__action-btn patient-table__action-btn--new-prescription"
                  onClick={() => handleNewPrescription(patient)}
                  title="Nueva receta externa"
                >
                  <MuiSvgIcon size={18}>lucide:circle-plus</MuiSvgIcon>
                </button>
                
                {/* Botón Eliminar */}
                <button
                  className="patient-table__action-btn patient-table__action-btn--delete"
                  onClick={() => handleDelete(patient?.id)}
                  disabled={isDeleting && deletingId === patient?.id}
                  title="Eliminar paciente"
                >
                  {isDeleting && deletingId === patient?.id ? (
                    <span className="patient-table__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
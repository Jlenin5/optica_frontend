import { useState, useMemo, useEffect, useRef } from "react"
import type { Patient } from "@patients/types/patients.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PatientSearchProps {
  patients: Patient[]
  onSelect: (patient: Patient) => void
  selectedPatient: Patient | null
  isLoading?: boolean
}

export const PatientSearch = ({ patients, onSelect, selectedPatient, isLoading }: PatientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients.slice(0, 5)
    const term = searchTerm.toLowerCase()
    return patients.filter(patient => 
      patient.first_name.toLowerCase().includes(term) ||
      patient.last_name.toLowerCase().includes(term) ||
      patient.document_number.includes(term) ||
      patient.phone.includes(term)
    ).slice(0, 10)
  }, [patients, searchTerm])

  const handleSelect = (patient: Patient) => {
    onSelect(patient)
    setSearchTerm(`${patient.first_name} ${patient.last_name} - ${patient.document_number}`)
    setIsOpen(false)
  }

  const clearSelection = () => {
    onSelect(null as any)
    setSearchTerm("")
    setIsOpen(false)
  }

  const handleFocus = () => {
    setIsOpen(true)
    if (selectedPatient) {
      setSearchTerm("")
    }
  }

  if (isLoading) {
    return (
      <div className="patient-search__loading">
        <div className="patient-search__spinner"></div>
        <span>Cargando pacientes...</span>
      </div>
    )
  }

  return (
    <div className="patient-search">
      <div className="patient-search__input-wrapper">
        <MuiSvgIcon size={20} className="patient-search__icon">
          lucide:search
        </MuiSvgIcon>
        <input
          type="text"
          className="patient-search__input"
          placeholder="Buscar por nombre, documento o teléfono..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
            if (selectedPatient) onSelect(null as any)
          }}
          onFocus={handleFocus}
        />
        {selectedPatient && (
          <button className="patient-search__clear" onClick={clearSelection}>
            <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
          </button>
        )}
      </div>

      {isOpen && filteredPatients.length > 0 && (
        <div className="patient-search__dropdown">
          {filteredPatients.length > 0 ? (
            <div className="patient-search__dropdown">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="patient-search__item"
                  onClick={() => handleSelect(patient)}
                >
                  <div className="patient-search__item-avatar">
                    {`${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}
                  </div>
                  <div className="patient-search__item-info">
                    <div className="patient-search__item-name">
                      {patient.first_name} {patient.last_name}
                    </div>
                    <div className="patient-search__item-details">
                      <span className="patient-search__item-document">{patient.document_number}</span>
                      <span className="patient-search__item-phone">{patient.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            searchTerm && (
              <div className="patient-search__empty">
                <MuiSvgIcon size={24}>lucide:user-search</MuiSvgIcon>
                <p>No se encontraron pacientes</p>
                <button className="patient-search__create-btn">
                  Crear nuevo paciente
                </button>
              </div>
            )
          )}
        </div>
      )}

      {isOpen && searchTerm && filteredPatients.length === 0 && (
        <div className="patient-search__empty">
          <MuiSvgIcon size={24}>lucide:user-search</MuiSvgIcon>
          <p>No se encontraron pacientes</p>
          <button className="patient-search__create-btn">
            Crear nuevo paciente
          </button>
        </div>
      )}
    </div>
  )
}
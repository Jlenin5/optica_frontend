import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode, KeyboardEvent } from "react"
import MuiSvgIcon from "@components/MuiSvgIcon"

export type AutocompleteMode = "search" | "input-register"

export interface AutocompleteInputProps<T> {
  value: string
  options: T[]
  onChange: (value: string) => void
  onSelect?: (option: T) => void
  getOptionLabel: (option: T) => string
  getOptionValue?: (option: T) => string | number
  filterOption?: (option: T, input: string) => boolean
  placeholder?: string
  mode?: AutocompleteMode
  disabled?: boolean
  loading?: boolean
  maxResults?: number
  minChars?: number
  noOptionsText?: string
  className?: string
  icon?: string
  clearable?: boolean
  renderOption?: (option: T, active: boolean) => ReactNode
  onEnter?: (value: string) => void
}

/** Reusable autocomplete for search filters and register/form inputs. */
export function AutocompleteInput<T>({
  value, options, onChange, onSelect, getOptionLabel, getOptionValue, filterOption,
  placeholder = "Buscar...", mode = "search", disabled = false, loading = false,
  maxResults = 8, minChars = 0, noOptionsText = "No se encontraron resultados",
  className = "", clearable = true, renderOption, onEnter,
}: AutocompleteInputProps<T>) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const normalizedValue = value.trim().toLowerCase()

  const filteredOptions = useMemo(() => {
    if (!normalizedValue) return options.slice(0, maxResults)
    return options.filter((option) =>
      filterOption
        ? filterOption(option, normalizedValue)
        : getOptionLabel(option).toLowerCase().includes(normalizedValue),
    ).slice(0, maxResults)
  }, [options, normalizedValue, getOptionLabel, filterOption, maxResults])

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  useEffect(() => setActiveIndex(-1), [value])

  const selectOption = (option: T) => {
    onChange(getOptionLabel(option))
    onSelect?.(option)
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") return setOpen(false)
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1))
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
      return
    }
    if (event.key === "Enter") {
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        event.preventDefault()
        selectOption(filteredOptions[activeIndex])
      } else {
        onEnter?.(value)
      }
    }
  }

  const showDropdown = open && !disabled && value.trim().length >= minChars

  return (
    <div ref={rootRef} className={`autocomplete-input autocomplete-input--${mode} ${className}`.trim()}>
      <div className="autocomplete-input__control">
        <input
          type="text" value={value} disabled={disabled} placeholder={placeholder}
          autoComplete="off" role="combobox" aria-expanded={showDropdown}
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(event) => { onChange(event.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
        />
        {clearable && value && !disabled && (
          <button type="button" className="autocomplete-input__clear" aria-label="Limpiar"
            onClick={() => { onChange(""); setOpen(true) }}>
            <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
          </button>
        )}
      </div>
      {showDropdown && (
        <div className="autocomplete-input__dropdown" role="listbox">
          {loading ? <div className="autocomplete-input__state">Cargando...</div> :
            filteredOptions.length ? filteredOptions.map((option, index) => (
              <button type="button"
                key={getOptionValue?.(option) ?? `${getOptionLabel(option)}-${index}`}
                className={`autocomplete-input__option ${activeIndex === index ? "is-active" : ""}`}
                role="option" aria-selected={activeIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}>
                {renderOption ? renderOption(option, activeIndex === index) : getOptionLabel(option)}
              </button>
            )) :
            <div className="autocomplete-input__state">{value.trim() ? noOptionsText :
              mode === "input-register" ? "Escriba para ver sugerencias" : "Escriba para buscar"}</div>}
        </div>
      )}
    </div>
  )
}

export default AutocompleteInput

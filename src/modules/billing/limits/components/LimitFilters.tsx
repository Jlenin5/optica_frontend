import MuiSvgIcon from '@components/MuiSvgIcon'

interface LimitFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const LimitFilters = ({ searchTerm, onSearchChange }: LimitFiltersProps) => {
  return (
    <div className="limit-filters">
      <div className="limit-filters__search">
        <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
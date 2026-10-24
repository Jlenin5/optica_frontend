import MuiSvgIcon from '@components/MuiSvgIcon'

interface FeatureFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const FeatureFilters = ({ searchTerm, onSearchChange }: FeatureFiltersProps) => {
  return (
    <div className="feature-filters">
      <div className="feature-filters__search">
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
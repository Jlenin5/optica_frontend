import MuiSvgIcon from '@components/MuiSvgIcon'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const colorVariants = {
  blue: 'stats-card--blue',
  green: 'stats-card--green',
  purple: 'stats-card--purple',
  orange: 'stats-card--orange',
  red: 'stats-card--red',
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => (
  <article className={`stats-card ${colorVariants[color]}`}>
    <div className="stats-card__icon-wrapper"><MuiSvgIcon size={22}>{icon}</MuiSvgIcon></div>
    <div className="stats-card__body">
      <div className="stats-card__value">{value}</div>
      <div className="stats-card__title">{title}</div>
    </div>
  </article>
)

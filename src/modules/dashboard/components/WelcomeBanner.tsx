import MuiSvgIcon from '@components/MuiSvgIcon'

interface WelcomeBannerProps {
  greeting: string
  username?: string
  companyName?: string
  branchName?: string
}

export const WelcomeBanner = ({ greeting, username, companyName, branchName }: WelcomeBannerProps) => {
  const date = new Intl.DateTimeFormat("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())

  return (
    <section className="welcome-banner">
      <div className="welcome-banner__content">
        <div className="welcome-banner__eyebrow"><span className="welcome-banner__status-dot" />Panel operativo</div>
        <h1 className="welcome-banner__greeting">{greeting}, {username || "usuario"}</h1>
        <p className="welcome-banner__message">Supervisa pacientes, citas, ventas y el flujo de laboratorio desde un solo lugar.</p>
        <div className="welcome-banner__stats">
          <div className="welcome-banner__stat"><MuiSvgIcon size={18}>lucide:calendar</MuiSvgIcon><span>{date}</span></div>
          {companyName && <div className="welcome-banner__stat"><MuiSvgIcon size={18}>lucide:building-2</MuiSvgIcon><span>{companyName}{branchName ? ` · ${branchName}` : ""}</span></div>}
        </div>
      </div>
      <div className="welcome-banner__decoration" aria-hidden="true">
        <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
          <circle cx="170" cy="80" r="92" /><circle cx="170" cy="80" r="64" /><circle cx="170" cy="80" r="36" /><path d="M78 80h184M170 -12v184" />
        </svg>
      </div>
    </section>
  )
}

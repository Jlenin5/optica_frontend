export const SettingsSkeleton = () => {
  return (
    <div className="settings-skeleton">
      <div className="settings-skeleton__header">
        <div className="settings-skeleton__line settings-skeleton__line--title"></div>
        <div className="settings-skeleton__line settings-skeleton__line--subtitle"></div>
      </div>

      <div className="settings-skeleton__layout">
        <div className="settings-skeleton__sidebar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="settings-skeleton__nav-item"></div>
          ))}
        </div>
        <div className="settings-skeleton__content">
          <div className="settings-skeleton__section"></div>
          <div className="settings-skeleton__section"></div>
          <div className="settings-skeleton__section"></div>
        </div>
      </div>
    </div>
  )
}
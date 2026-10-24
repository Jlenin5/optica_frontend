export const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="profile-skeleton__header">
        <div className="profile-skeleton__line profile-skeleton__line--title"></div>
        <div className="profile-skeleton__line profile-skeleton__line--subtitle"></div>
      </div>

      <div className="profile-skeleton__tabs">
        <div className="profile-skeleton__tab"></div>
        <div className="profile-skeleton__tab"></div>
        <div className="profile-skeleton__tab"></div>
      </div>

      <div className="profile-skeleton__content">
        <div className="profile-skeleton__avatar">
          <div className="profile-skeleton__avatar-circle"></div>
          <div className="profile-skeleton__avatar-btn"></div>
        </div>
        <div className="profile-skeleton__info">
          <div className="profile-skeleton__section">
            <div className="profile-skeleton__section-title"></div>
            <div className="profile-skeleton__grid">
              <div className="profile-skeleton__item"></div>
              <div className="profile-skeleton__item"></div>
              <div className="profile-skeleton__item"></div>
              <div className="profile-skeleton__item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
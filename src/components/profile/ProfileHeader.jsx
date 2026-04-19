export default function ProfileHeader({ auth, onEdit }) {
  const avatarUrl = auth.avatar?.url || auth.avatar || "";
  const bannerUrl = auth.banner?.url || auth.banner || "";

  return (
    <section className="card shadow-sm border-0 profile-header overflow-hidden">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={`${auth.name} banner`}
          className="profile-banner img-fluid"
        />
      ) : (
        <div className="profile-banner profile-banner--fallback" />
      )}

      <div className="card-body p-4 p-lg-5">
        <div className="text-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${auth.name} avatar`}
              className="profile-avatar rounded-circle img-fluid mb-3"
            />
          ) : (
            <div className="profile-avatar profile-avatar--fallback rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
              <span className="profile-avatar--initial">
                {auth.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="h3 mb-1">{auth.name}</h1>
          <p className="text-muted mb-3">{auth.email}</p>

          <div className="d-flex justify-content-center mb-4">
            <span className="profile-account-badge">
              {auth.venueManager ? "Venue Manager" : "Customer"}
            </span>
          </div>

          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-accent" onClick={onEdit}>
              Edit profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

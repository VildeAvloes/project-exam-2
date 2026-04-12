export default function ProfileHeader({ auth, onEdit }) {
  const avatarUrl = auth.avatar?.url || auth.avatar || "";
  const bannerUrl = auth.banner?.url || auth.banner || "";

  return (
    <div className="card shadow overflow-hidden">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={`${auth.name} banner`}
          className="profile-banner  img-fluid"
        />
      ) : (
        <div className="profile-banner bg-primary-subtle"></div>
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
            <div className="profile-avatar rounded-circle bg-secondary-subtle d-inline-flex align-items-center justify-content-center mb-3">
              <span className="fs-2 text-secondary">
                {auth.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="h4 mb-1">{auth.name}</h1>
          <p className="text-muted mb-2">{auth.email}</p>
          <p className="mb-4">
            <span className="fw-semibold">Account type:</span>{" "}
            {auth.venueManager ? "Venue Manager" : "Customer"}
          </p>

          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-accent" onClick={onEdit}>
              Edit profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

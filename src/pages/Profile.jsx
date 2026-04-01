import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const avatarUrl = auth.avatar?.url || auth.avatar || "";

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="text-center mb-4">
            <h1 className="mb-3">Profile</h1>
            <p className="text-muted mb-0">Manage your account information.</p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-lg-5">
              <div className="text-center mb-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${auth.name} avatar`}
                    className="rounded-circle img-fluid mb-3"
                  />
                ) : (
                  <div className="rounded-circle bg-secondary-subtle d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-2 text-secondary">
                      {auth.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <h2 className="h4 mb-1">{auth.name}</h2>
                <p className="text-muted mb-0">{auth.email}</p>
              </div>

              <div className="mb-3">
                <span className="fw-semibold">Account type:</span>{" "}
                {auth.venueManager ? "Venue Manager" : "Customer"}
              </div>

              <div className="d-grid">
                <button type="button" className="btn btn-primary">
                  Update avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

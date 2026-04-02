import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfile from "../components/profile/EditProfile";

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <h1 className="mb-4 text-center">Profile</h1>

          <ProfileHeader auth={auth} onEdit={() => setIsEditing(true)} />

          {isEditing && (
            <div className="mt-4">
              <EditProfile
                auth={auth}
                setAuth={setAuth}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          )}

          <div className="mt-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Overview</h2>
                <p className="mb-0 ">Place for venues and bookings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

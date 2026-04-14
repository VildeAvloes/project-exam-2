import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfile from "../components/profile/EditProfile";
import Loader from "../components/common/Loader";
import MyBookings from "../components/profile/MyBookings";
import MyVenues from "../components/venues/MyVenues";

export default function Profile() {
  const { auth, setAuth, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.title = "Holidaze | Profile";
  }, []);

  if (loading) {
    return <Loader text="Loading profile.." />;
  }

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
            {auth.venueManager ? (
              <MyVenues auth={auth} />
            ) : (
              <MyBookings auth={auth} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import EditProfile from "../components/profile/EditProfile";
import MyBookings from "../components/profile/MyBookings";
import ProfileHeader from "../components/profile/ProfileHeader";
import MyVenues from "../components/venues/manager/MyVenues";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { auth, setAuth, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.title = "Holidaze | Profile";
  }, []);

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
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

          {auth.venueManager && <MyVenues auth={auth} />}
          <MyBookings auth={auth} />
        </div>
      </div>
    </section>
  );
}

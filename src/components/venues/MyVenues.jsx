import { useEffect, useState } from "react";
import { getVenuesByProfile } from "../../api/venues/getVenuesByProfile";
import Loader from "../common/Loader";
import Message from "../common/Message";
import { useNavigate } from "react-router-dom";

export default function MyVenues({ auth }) {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadVenues();
  }, []);

  async function loadVenues() {
    try {
      const data = await getVenuesByProfile(auth.name);
      setVenues(data);
    } catch (error) {
      setStatus({
        type: "error",
        title: "Failed to load venues",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader text="Loading venues..." />;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-3">
        <h2 className="h5 mb-0">My venues</h2>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate("/manager/venues/new")}
        >
          Create venue
        </button>
      </div>

      {status && (
        <Message
          variant="danger"
          title={status.title}
          message={status.message}
          center={false}
        />
      )}

      {!venues.length ? (
        <Message
          variant="info"
          title="No venues yet"
          message="You haven’t created any venues yet."
          center={false}
        />
      ) : (
        <div className="d-flex flex-column gap-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="card shadow-sm border-0 p-3 d-flex flex-row justify-content-between align-items-center"
            >
              <div>
                <h3 className="h6 mb-1">{venue.name}</h3>
                <p className="text-muted small mb-0">${venue.price} / night</p>
              </div>

              <button
                className="btn btn-outline-accent btn-sm"
                onClick={() => navigate(`/manager/venues/${venue.id}`)}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

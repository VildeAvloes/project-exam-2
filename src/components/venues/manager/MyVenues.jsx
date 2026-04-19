import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVenuesByProfile } from "../../../api/venues/getVenuesByProfile";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import VenueList from "./VenueList";

export default function MyVenues({ auth }) {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadVenues() {
      try {
        setLoading(true);
        setStatus(null);

        const data = await getVenuesByProfile(auth.name);
        setVenues(data);
      } catch (error) {
        setStatus({
          type: "error",
          title: "Failed to load venues",
          message: error.message || "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, [auth]);

  if (loading) {
    return <Loader text="Loading venues..." />;
  }

  if (status?.type === "error") {
    return (
      <Message
        variant="danger"
        title={status.title}
        message={status.message}
        center={false}
      />
    );
  }

  return (
    <section className="py-5">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">My venues</h2>
          <p className="text-muted mb-0">
            Manage your listings and update your venues.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/manager/venues/new")}
        >
          Create venue
        </button>
      </div>

      <VenueList
        venues={venues}
        onManage={(venueId) => navigate(`/manager/venues/${venueId}`)}
      />
    </section>
  );
}

import { useEffect, useState } from "react";
import { getVenues } from "../api/venues/getVenues";
import VenueCard from "../components/venues/VenueCard";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Holidaze | Home";
  }, []);

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await getVenues();
        setVenues(data);

        if (!data.length) {
          setStatus({
            type: "info",
            title: "No venues found",
            message: "There are no venues to display right now.",
          });
        } else {
          setStatus(null);
        }
      } catch (err) {
        setStatus({
          type: "error",
          title: "Something went wrong",
          message: err.message || "Failed to load venues.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  if (loading) {
    return <Loader text="Loading venues..." />;
  }

  if (status && status.type === "error") {
    return (
      <Message variant="danger" title={status.title} message={status.message} />
    );
  }

  if (status && status.type === "info") {
    return (
      <Message variant="info" title={status.title} message={status.message} />
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Venues</h1>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const featuredVenues = venues.slice(0, 6);

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
    <>
      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-lg-8">
            <h1 className="display-5 mb-3">Find your next stay</h1>
            <p className="lead text-muted mb-4">
              Discover unique venues for weekends away, city breaks, and longer
              stays.
            </p>

            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Link to="/register" className="btn btn-secondary">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="h3 mb-1">Featured venues</h2>
            <p className="text-muted mb-0">
              A small selection to get you started.
            </p>
          </div>

          <Link to="/venues" className="btn btn-outline-accent">
            View all venues
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {featuredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="card shadow">
          <div className="card-body p-4 p-lg-5 text-center">
            <h2 className="h4 mb-3">Venue Manager Info</h2>
            <p className="text-muted mb-4">Launch your venues etc.</p>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

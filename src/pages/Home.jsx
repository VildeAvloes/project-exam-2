import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedVenues } from "../api/venues/getFeaturedVenues";
import VenueCard from "../components/venues/VenueCard";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { auth } = useAuth();

  const [venues, setVenues] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerLink = auth ? "/profile" : "/register";

  useEffect(() => {
    document.title = "Holidaze | Home";
  }, []);

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await getFeaturedVenues();
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

  if (status?.type === "error") {
    return (
      <Message variant="danger" title={status.title} message={status.message} />
    );
  }

  if (status?.type === "info") {
    return (
      <Message variant="info" title={status.title} message={status.message} />
    );
  }

  return (
    <>
      <section className="py-5 ">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-lg-8">
              <p className="home-intro-txt text-uppercase fw-semibold mb-2">
                Calm stays, better trips
              </p>

              <h1 className="display-4 mb-3">
                Find your next stay with a little more ease
              </h1>

              <p className="lead text-muted mb-4">
                Discover unique venues for weekends away, city breaks, and
                longer stays — all in one simple place.
              </p>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <Link to={registerLink} className="btn btn-secondary">
                  {auth ? "Go to profile" : "Get started"}
                </Link>
                <Link to="/venues" className="btn btn-outline-primary">
                  View venues
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5 ">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="h3 mb-1">Featured venues</h2>
            <p className="text-muted mb-0">
              A curated selection to inspire your next trip.
            </p>
          </div>

          <Link to="/venues" className="btn btn-outline-primary">
            View all venues
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-lg-5 text-center">
            <p className="text-uppercase text-muted fw-semibold small mb-2">
              Venue managers
            </p>
            <h2 className="h4 mb-3">Share places people want to return to</h2>
            <p className="text-muted mb-4">
              Create and manage your venues, stay on top of bookings, and
              present your spaces in a clean, inviting way.
            </p>
            <Link to={registerLink} className="btn btn-accent">
              {auth ? "Go to profile" : "Register as manager"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

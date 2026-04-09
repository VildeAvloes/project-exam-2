import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../api/venues/getVenueById";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import BookingForm from "../components/bookings/BookingForm";

export default function Venue() {
  const { id } = useParams();

  const [venue, setVenue] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Holidaze | Venue";
  }, []);

  useEffect(() => {
    async function loadVenue() {
      try {
        const data = await getVenueById(id);
        setVenue(data);
        setStatus(null);
      } catch (error) {
        setStatus({
          type: "error",
          title: "Something went wrong",
          message: error.message || "Failed to load venue.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (loading) {
    return <Loader text="Loading venue..." />;
  }

  if (status && status.type === "error") {
    return (
      <Message variant="danger" title={status.title} message={status.message} />
    );
  }

  if (!venue) {
    return (
      <Message
        variant="info"
        title="Venue not found"
        message="The requested venue could not be found."
      />
    );
  }

  const image = venue.media?.[0]?.url || "";
  const city = venue.location?.city || "Unknown city";
  const country = venue.location?.country || "";
  const locationText = country ? `${city}, ${country}` : city;

  return (
    <section className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          {image ? (
            <img
              src={image}
              alt={venue.name}
              className="img-fluid rounded w-100"
            />
          ) : (
            <div className="venue-image-fallback rounded" />
          )}
        </div>

        <div className="col-12 col-lg-5">
          <p className="text-uppercase text-muted fw-semibold mb-2">Venue</p>
          <h1 className="mb-3">{venue.name}</h1>
          <p className="text-muted mb-2">{locationText}</p>
          <p className="mb-3">{venue.description}</p>

          <div className="mb-2">
            <span className="fw-semibold">Price:</span> ${venue.price} / night
          </div>

          <div className="mb-2">
            <span className="fw-semibold">Max guests:</span> {venue.maxGuests}
          </div>

          <div className="mb-2">
            <span className="fw-semibold">Rating:</span> {venue.rating}
          </div>
        </div>
      </div>

      <BookingForm venueId={venue.id} maxGuests={venue.maxGuests} />
    </section>
  );
}

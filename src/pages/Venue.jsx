import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaWifi, FaParking, FaCoffee, FaPaw, FaStar } from "react-icons/fa";
import { FiMapPin, FiUsers } from "react-icons/fi";
import { getVenueById } from "../api/venues/getVenueById";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import BookingForm from "../components/bookings/BookingForm";
import VenueGallery from "../components/venues/VenueGallery";

export default function Venue() {
  const { id } = useParams();

  const [venue, setVenue] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Holidaze | Venue";
  }, []);

  async function loadVenue() {
    try {
      const data = await getVenueById(id, "?_bookings=true&_owner=true");
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

  useEffect(() => {
    loadVenue();
  }, [id]);

  if (loading) {
    return <Loader text="Loading venue..." />;
  }

  if (status?.type === "error") {
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

  const city = venue.location?.city || "Unknown city";
  const country = venue.location?.country || "";
  const locationText = country ? `${city}, ${country}` : city;
  const owner = venue.owner;
  const ownerAvatar = owner?.avatar?.url || owner?.avatar || "";

  const amenities = [
    { label: "WiFi", value: venue.meta?.wifi, icon: FaWifi },
    { label: "Parking", value: venue.meta?.parking, icon: FaParking },
    { label: "Breakfast", value: venue.meta?.breakfast, icon: FaCoffee },
    { label: "Pets allowed", value: venue.meta?.pets, icon: FaPaw },
  ].filter((item) => item.value);

  return (
    <section className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-7">
          <VenueGallery media={venue.media || []} fallbackAlt={venue.name} />
        </div>

        <div className="col-12 col-lg-5">
          <div className="pt-3">
            <h1 className="mb-3">{venue.name}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <p className="mb-0 d-inline-flex align-items-center gap-2">
                <FiMapPin />
                <span>{locationText}</span>
              </p>

              <span className="venue-rating-badge">
                <FaStar aria-hidden="true" />
                <span>{venue.rating ?? 0}</span>
              </span>
            </div>

            {owner && (
              <div className="venue-host d-flex align-items-center gap-3 mb-4 py-3">
                {ownerAvatar ? (
                  <img
                    src={ownerAvatar}
                    alt={`${owner.name} avatar`}
                    className="venue-host-avatar"
                  />
                ) : (
                  <div className="venue-host-avatar venue-host-avatar--fallback d-flex align-items-center justify-content-center">
                    <span>{owner.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}

                <div>
                  <p className="small text-muted mb-1">Hosted by</p>
                  <p className="fw-semibold mb-0">{owner.name}</p>
                </div>
              </div>
            )}

            <p className="mb-4">{venue.description}</p>

            <div className="d-flex align-items-end gap-2 mb-4 ">
              <span className="h3 mb-0 text-secondary">${venue.price}</span>
              <span className="text-muted mb-1">/ night</span>
            </div>

            <div className="mb-4">
              <p className="small text-muted mb-1">Max guests</p>
              <p className="mb-0 fw-semibold d-inline-flex align-items-center gap-2">
                <FiUsers />
                <span>{venue.maxGuests}</span>
              </p>
            </div>

            {amenities.length > 0 && (
              <div>
                <h2 className="h6 mb-3">Amenities</h2>

                <ul className="venue-amenities list-unstyled d-flex flex-wrap gap-2 mb-0">
                  {amenities.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.label} className="venue-amenity">
                        <Icon
                          className="venue-amenity-icon"
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="card shadow-sm border-0 ">
          <div className="card-body p-4 p-lg-5">
            <div className="mb-4 text-center text-lg-start">
              <p className="text-uppercase text-muted fw-semibold small mb-2">
                Booking
              </p>
              <h2 className="h4 mb-2">Plan your stay</h2>
              <p className="text-muted mb-0">
                Choose your dates and number of guests to reserve this venue.
              </p>
            </div>

            <BookingForm
              venueId={venue.id}
              maxGuests={venue.maxGuests}
              bookings={venue.bookings || []}
              onBookingCreated={loadVenue}
              embedded
            />
          </div>
        </div>
      </div>
    </section>
  );
}

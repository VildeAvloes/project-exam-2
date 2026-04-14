import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaWifi, FaParking, FaCoffee, FaPaw } from "react-icons/fa";
import { getVenueById } from "../api/venues/getVenueById";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import BookingForm from "../components/bookings/BookingForm";

export default function Venue() {
  const { id } = useParams();
  const location = useLocation();

  const previewVenue = location.state?.previewVenue || null;
  const isPreview = Boolean(previewVenue);

  const [venue, setVenue] = useState(previewVenue);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(!isPreview);

  useEffect(() => {
    document.title = isPreview
      ? "Holidaze | Venue Preview"
      : "Holidaze | Venue";
  }, [isPreview]);

  useEffect(() => {
    if (isPreview) return;

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
  }, [id, isPreview]);

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

  const image = venue.media?.[0]?.url || "";
  const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue image";
  const city = venue.location?.city || "Unknown city";
  const country = venue.location?.country || "";
  const locationText = country ? `${city}, ${country}` : city;

  const amenities = [
    { label: "WiFi", value: venue.meta?.wifi, icon: FaWifi },
    { label: "Parking", value: venue.meta?.parking, icon: FaParking },
    { label: "Breakfast", value: venue.meta?.breakfast, icon: FaCoffee },
    { label: "Pets allowed", value: venue.meta?.pets, icon: FaPaw },
  ].filter((item) => item.value);

  return (
    <section className="container py-5">
      {isPreview && (
        <div className="mb-4">
          <Message
            variant="info"
            title="Preview mode"
            message="This is a preview of your venue before saving."
            center={false}
          />
        </div>
      )}

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-7">
          <div className="venue-hero-card card shadow-sm border-0">
            {image ? (
              <img
                src={image}
                alt={imageAlt}
                className="img-fluid w-100 venue-hero-image"
              />
            ) : (
              <div className="venue-image-fallback rounded venue-hero-image-placeholder" />
            )}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4 p-lg-5">
              <p className="text-uppercase text-muted fw-semibold small mb-2">
                Venue
              </p>

              <h1 className="mb-3">{venue.name}</h1>

              <p className="text-muted mb-4">{locationText}</p>

              <p className="mb-4">{venue.description}</p>

              <div className="d-flex align-items-end gap-2 mb-4">
                <span className="h3 mb-0 venue-price">${venue.price}</span>
                <span className="text-muted mb-1">/ night</span>
              </div>

              <div className="row row-cols-2 g-3 mb-4">
                <div>
                  <p className="small text-muted mb-1">Max guests</p>
                  <p className="mb-0 fw-semibold">{venue.maxGuests}</p>
                </div>

                <div>
                  <p className="small text-muted mb-1">Rating</p>
                  <p className="mb-0 fw-semibold">{venue.rating ?? 0}</p>
                </div>
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
                            className="venue-amenity__icon"
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
      </div>

      {!isPreview && (
        <div className="mt-4">
          <BookingForm venueId={venue.id} maxGuests={venue.maxGuests} />
        </div>
      )}
    </section>
  );
}

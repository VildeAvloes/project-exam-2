import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function VenueCard({ venue }) {
  const image = venue.media?.[0]?.url;
  const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue image";

  const city = venue.location?.city || "Unknown city";
  const country = venue.location?.country || "";
  const location = country ? `${city}, ${country}` : city;

  return (
    <div className="col">
      <Link
        to={`/venue/${venue.id}`}
        className="card venue-card h-100 text-decoration-none"
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="card-img-top venue-card-image"
          />
        ) : (
          <div className="venue-card-image-placeholder d-flex align-items-center justify-content-center">
            <span className="text-muted small">No image</span>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <h3 className="venue-card-title mb-1">{venue.name}</h3>
            <p className="venue-card-location mb-0">{location}</p>
          </div>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <p className="venue-card-price mb-0">
              ${venue.price}
              <span className="text-muted"> / night</span>
            </p>

            <span className="venue-card-cta">
              View
              <FiArrowRight />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

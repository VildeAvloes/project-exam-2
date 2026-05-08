import { Link } from "react-router-dom";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

export default function VenueCard({ venue }) {
  const [imageError, setImageError] = useState(false);

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
        {image && !imageError ? (
          <img
            src={image}
            alt={imageAlt}
            className="card-img-top venue-card-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="venue-card-image d-flex align-items-center justify-content-center bg-light">
            <span className="text-muted small">No image</span>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-start mb-1">
              <p className="venue-card-title mb-0 h3">{venue.name}</p>

              <div className="d-flex align-items-center gap-2">
                <span className="venue-card-rating">
                  <FaStar aria-hidden="true" />
                  <span className="visually-hidden">Rating:</span>
                  <span>{venue.rating ?? 0}</span>
                </span>
              </div>
            </div>

            <p className="venue-card-location mb-0">{location}</p>
          </div>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <p className="fw-semibold text-primary mb-0">
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

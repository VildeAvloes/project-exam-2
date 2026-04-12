import { Link } from "react-router-dom";

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
        className="card venue-card h-100 shadow-sm text-decoration-none"
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="card-img-top venue-card-image"
          />
        ) : (
          <div className="bg-light d-flex align-items-center justify-content-center venue-card-image-placeholder">
            <span className="text-muted">No image available</span>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <p className="h5 text-dark mb-2">{venue.name}</p>
            <p className="text-muted mb-2">{location}</p>
          </div>

          <div className="mt-auto d-flex justify-content-between align-items-center ">
            <p className="mb-0 fw-semibold text-primary">
              ${venue.price}{" "}
              <span className="fw-normal text-muted">/ night</span>
            </p>

            <span className="fw-semibold">View venue</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

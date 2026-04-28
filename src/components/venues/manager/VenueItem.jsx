import { Link } from "react-router-dom";

export default function VenueItem({ venue, onManage }) {
  const venueId = venue?.id || venue?._id;
  const image = venue?.media?.[0]?.url;
  const imageAlt = venue?.media?.[0]?.alt || venue?.name || "Venue image";

  const city = venue?.location?.city || "Unknown city";
  const country = venue?.location?.country || "";
  const location = country ? `${city}, ${country}` : city;

  return (
    <article className="card shadow-sm border-0 venue-item">
      <div className="row g-0">
        <div className="col-12 col-md-4 col-lg-3">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className="img-fluid w-100 h-100 venue-item-image"
            />
          ) : (
            <div className="venue-item-image d-flex align-items-center justify-content-center h-100">
              <span className="text-muted">No image available</span>
            </div>
          )}
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          <div className="card-body h-100 d-flex flex-column p-4">
            <div className="mb-3">
              <h3 className="h5 mb-1">{venue?.name || "Untitled venue"}</h3>
              <p className="text-muted mb-0">{location}</p>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 mb-4">
              <div className="venue-item__fact">
                <p className="small text-muted mb-1">Price</p>
                <p className="mb-0 fw-semibold">${venue?.price ?? 0} / night</p>
              </div>

              <div className="venue-item__fact">
                <p className="small text-muted mb-1">Max guests</p>
                <p className="mb-0 fw-semibold">{venue?.maxGuests ?? 0}</p>
              </div>

              <div className="venue-item__fact">
                <p className="small text-muted mb-1">Rating</p>
                <p className="mb-0 fw-semibold">{venue?.rating ?? 0}</p>
              </div>
            </div>

            <div className="d-flex justify-content-center justify-content-md-end mt-auto">
              <div className="d-flex gap-2 justify-content-center justify-content-md-end flex-wrap mt-auto">
                {venueId && (
                  <Link
                    to={`/venue/${venueId}`}
                    className="btn btn-outline-primary"
                  >
                    View venue
                  </Link>
                )}
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={onManage}
                >
                  Manage venue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

import { Link } from "react-router-dom";

function formatDate(dateString) {
  if (!dateString) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function getNights(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) return 0;

  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  const diffMs = end - start;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.max(diffDays, 0);
}

function getBookingStatus(dateFrom, dateTo) {
  const today = new Date();
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  if (today < start) return "Upcoming";
  if (today > end) return "Past";
  return "Active";
}

function getStatusClass(status) {
  if (status === "Upcoming") return "booking-status upcoming";
  if (status === "Active") return "booking-status active";
  return "booking-status past";
}

export default function BookingItem({ booking, onEdit }) {
  const venue = booking?.venue;
  const venueId = venue?.id || venue?._id;
  const image = venue?.media?.[0]?.url;
  const imageAlt = venue?.media?.[0]?.alt || venue?.name || "Venue image";
  const location = [venue?.location?.city, venue?.location?.country]
    .filter(Boolean)
    .join(", ");
  const status = getBookingStatus(booking?.dateFrom, booking?.dateTo);

  return (
    <article className="card shadow-sm border-0 booking-item">
      <div className="row g-0">
        <div className="col-12 col-md-4 col-lg-3">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className="img-fluid w-100 h-100 booking-item-image"
            />
          ) : (
            <div className="booking-item-image d-flex align-items-center justify-content-center h-100">
              <span className="text-muted">No image available</span>
            </div>
          )}
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          <div className="card-body h-100 d-flex flex-column p-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3 mb-3">
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                  <h3 className="h5 mb-0">{venue?.name || "Untitled venue"}</h3>
                  <span className={getStatusClass(status)}>{status}</span>
                </div>

                <p className="text-muted mb-0">
                  {location || "Unknown location"}
                </p>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4 ">
              <div>
                <p className="small text-muted mb-1">From</p>
                <p className="mb-0 fw-semibold">
                  {formatDate(booking?.dateFrom)}
                </p>
              </div>

              <div>
                <p className="small text-muted mb-1">To</p>
                <p className="mb-0 fw-semibold">
                  {formatDate(booking?.dateTo)}
                </p>
              </div>

              <div>
                <p className="small text-muted mb-1">Guests</p>
                <p className="mb-0 fw-semibold">{booking?.guests ?? 0}</p>
              </div>

              <div>
                <p className="small text-muted mb-1">Nights</p>
                <p className="mb-0 fw-semibold">
                  {getNights(booking?.dateFrom, booking?.dateTo)}
                </p>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center justify-content-md-end flex-wrap mt-auto">
              {venueId && (
                <Link
                  to={`/venue/${venueId}`}
                  className="btn btn-outline-primary"
                >
                  View venue
                </Link>
              )}

              <button type="button" className="btn btn-accent" onClick={onEdit}>
                Edit booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

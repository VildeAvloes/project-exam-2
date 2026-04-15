import Message from "../common/Message";

function formatDate(dateString) {
  if (!dateString) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function VenueBookingsList({ bookings = [] }) {
  if (!bookings.length) {
    return (
      <Message
        variant="info"
        title="No bookings yet"
        message="This venue does not have any bookings yet."
        center={false}
      />
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Bookings for this venue</h2>

        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => (
            <article
              key={booking.id || booking._id}
              className="card shadow-sm border-0"
            >
              <div className="card-body">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
                  <div>
                    <h3 className="h6 mb-1">
                      {booking.customer?.name || "Guest"}
                    </h3>
                    <p className="text-muted small mb-0">
                      {booking.customer?.email || "No email available"}
                    </p>
                  </div>

                  <div className="row row-cols-1 row-cols-sm-3 g-3 w-100 w-lg-auto">
                    <div>
                      <p className="small text-muted mb-1">From</p>
                      <p className="mb-0 fw-semibold">
                        {formatDate(booking.dateFrom)}
                      </p>
                    </div>

                    <div>
                      <p className="small text-muted mb-1">To</p>
                      <p className="mb-0 fw-semibold">
                        {formatDate(booking.dateTo)}
                      </p>
                    </div>

                    <div>
                      <p className="small text-muted mb-1">Guests</p>
                      <p className="mb-0 fw-semibold">{booking.guests}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

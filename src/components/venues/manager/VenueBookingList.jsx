import Message from "../../common/Message";

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
    <section>
      <div className="mb-4">
        <h2 className="h4 mb-1">Venue bookings</h2>
        <p className="text-muted mb-0">
          See who has booked this venue and for which dates.
        </p>
      </div>

      <div className="d-flex flex-column gap-3">
        {bookings.map((booking) => (
          <article
            key={booking.id || booking._id}
            className="card shadow-sm border-0"
          >
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-5">
                <div>
                  <p className="small text-muted mb-1">Booked by</p>
                  <p className="mb-0 fw-semibold">
                    {booking.customer?.name || "Guest"}
                  </p>
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
    </section>
  );
}

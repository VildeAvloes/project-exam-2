import Message from "../../common/Message";

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

export default function VenueBookingsList({ bookings = [], price = 0 }) {
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
        {bookings.map((booking) => {
          const customer = booking.customer;
          const avatarUrl = customer?.avatar?.url || customer?.avatar || "";
          const nights = getNights(booking.dateFrom, booking.dateTo);
          const totalPrice = nights * Number(price || 0);

          return (
            <article
              key={booking.id || booking._id}
              className="card shadow-sm border-0"
            >
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4">
                  <div className="d-flex align-items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={`${customer?.name || "Guest"} avatar`}
                        className="booking-customer-avatar"
                      />
                    ) : (
                      <div className="booking-customer-avatar booking-customer-avatar--fallback d-flex align-items-center justify-content-center">
                        <span>
                          {customer?.name?.charAt(0).toUpperCase() || "G"}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="small text-muted mb-1">Booked by</p>
                      <p className="mb-0 fw-semibold">
                        {customer?.name || "Guest"}
                      </p>
                      <p className="text-muted small mb-0">
                        {customer?.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-3 w-100 w-lg-auto">
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

                    <div>
                      <p className="small text-muted mb-1">Nights</p>
                      <p className="mb-0 fw-semibold">{nights}</p>
                    </div>

                    <div>
                      <p className="small text-muted mb-1">Total</p>
                      <p className="mb-0 fw-semibold">${totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

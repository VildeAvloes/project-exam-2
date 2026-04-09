import BookingCard from "./BookingCard";
import Message from "../common/Message";

export default function BookingList({ bookings = [] }) {
  if (!bookings.length) {
    return (
      <Message
        variant="info"
        title="No bookings yet"
        message="You haven’t made any bookings yet."
        center={false}
      />
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {bookings.map((booking) => (
        <BookingCard key={booking.id || booking._id} booking={booking} />
      ))}
    </div>
  );
}

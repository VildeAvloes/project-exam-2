import BookingItem from "./BookingItem";
import EditBookingForm from "./EditBookingForm";
import Message from "../common/Message";

export default function BookingList({
  bookings = [],
  editingBookingId,
  updatingBookingId,
  deletingBookingId,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) {
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
      {bookings.map((booking) => {
        const bookingId = booking.id || booking._id;

        if (editingBookingId === bookingId) {
          return (
            <EditBookingForm
              key={bookingId}
              booking={booking}
              isSubmitting={updatingBookingId === bookingId}
              isDeleting={deletingBookingId === bookingId}
              onCancel={onCancelEdit}
              onSave={onSave}
              onDelete={onDelete}
            />
          );
        }

        return (
          <BookingItem
            key={bookingId}
            booking={booking}
            onEdit={() => onEdit(bookingId)}
          />
        );
      })}
    </div>
  );
}

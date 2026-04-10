import { useEffect, useState } from "react";
import { getBookingsByProfile } from "../../api/bookings/getBookingsByProfile";
import Loader from "../common/Loader";
import Message from "../common/Message";
import BookingList from "../bookings/BookingList";
import { updateBooking } from "../../api/bookings/updateBooking";
import { deleteBooking } from "../../api/bookings/deleteBooking";

export default function MyBookings({ auth }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      if (!auth?.name || !auth?.accessToken || !auth?.apiKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setStatus(null);

        const data = await getBookingsByProfile(
          auth.name,
          auth.accessToken,
          auth.apiKey
        );

        const sortedBookings = [...data].sort(
          (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
        );

        setBookings(sortedBookings);
      } catch (error) {
        setStatus({
          type: "error",
          title: "Something went wrong",
          message: error.message || "Failed to load bookings.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [auth]);

  async function handleUpdateBooking(bookingId, updatedValues) {
    try {
      setUpdatingBookingId(bookingId);

      const updatedBooking = await updateBooking(bookingId, updatedValues);

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          (booking.id || booking._id) === bookingId
            ? {
                ...booking,
                ...updatedBooking,
                venue: booking.venue,
              }
            : booking
        )
      );

      setEditingBookingId(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to update booking.",
      };
    } finally {
      setUpdatingBookingId(null);
    }
  }

  async function handleDeleteBooking(bookingId) {
    try {
      setDeletingBookingId(bookingId);

      await deleteBooking(bookingId);

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => (booking.id || booking._id) !== bookingId
        )
      );

      setEditingBookingId(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to delete booking.",
      };
    } finally {
      setDeletingBookingId(null);
    }
  }

  function handleEditBooking(bookingId) {
    setEditingBookingId(bookingId);
  }

  function handleCancelEdit() {
    setEditingBookingId(null);
  }

  if (loading) {
    return <Loader text="Loading bookings..." />;
  }

  if (status?.type === "error") {
    return (
      <Message
        variant="danger"
        title={status.title}
        message={status.message}
        center={false}
      />
    );
  }

  return (
    <div className="card shadow">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">My bookings</h2>

        <BookingList
          bookings={bookings}
          editingBookingId={editingBookingId}
          updatingBookingId={updatingBookingId}
          deletingBookingId={deletingBookingId}
          onEdit={handleEditBooking}
          onCancelEdit={handleCancelEdit}
          onSave={handleUpdateBooking}
          onDelete={handleDeleteBooking}
        />
      </div>
    </div>
  );
}

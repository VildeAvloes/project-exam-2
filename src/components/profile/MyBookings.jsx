import { useEffect, useMemo, useState } from "react";
import { getBookingsByProfile } from "../../api/bookings/getBookingsByProfile";
import Loader from "../common/Loader";
import Message from "../common/Message";
import BookingList from "../bookings/BookingList";
import { updateBooking } from "../../api/bookings/updateBooking";
import { deleteBooking } from "../../api/bookings/deleteBooking";

function isPastBooking(booking) {
  const today = new Date();
  const end = new Date(booking.dateTo);

  return today > end;
}

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

        setBookings(data);
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

  const upcomingBookings = useMemo(() => {
    return bookings
      .filter((booking) => !isPastBooking(booking))
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }, [bookings]);

  const pastBookings = useMemo(() => {
    return bookings
      .filter((booking) => isPastBooking(booking))
      .sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom));
  }, [bookings]);

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
    <section className="py-5">
      <div className="mb-4">
        <h2 className="h4 mb-1">My bookings</h2>
        <p className="text-muted mb-0">View, update, or remove your stays.</p>
      </div>

      <div className="mb-5">
        <h3 className="h5 mb-3">Upcoming bookings</h3>
        <BookingList
          bookings={upcomingBookings}
          emptyTitle="No upcoming bookings"
          emptyMessage="You don’t have any upcoming stays."
          editingBookingId={editingBookingId}
          updatingBookingId={updatingBookingId}
          deletingBookingId={deletingBookingId}
          onEdit={handleEditBooking}
          onCancelEdit={handleCancelEdit}
          onSave={handleUpdateBooking}
          onDelete={handleDeleteBooking}
        />
      </div>

      <div>
        <h3 className="h5 mb-3">Past bookings</h3>
        <BookingList
          bookings={pastBookings}
          emptyTitle="No past bookings"
          emptyMessage="Your completed stays will appear here."
          editingBookingId={editingBookingId}
          updatingBookingId={updatingBookingId}
          deletingBookingId={deletingBookingId}
          onEdit={handleEditBooking}
          onCancelEdit={handleCancelEdit}
          onSave={handleUpdateBooking}
          onDelete={handleDeleteBooking}
        />
      </div>
    </section>
  );
}

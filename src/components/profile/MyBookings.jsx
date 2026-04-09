import { useEffect, useState } from "react";
import { getBookingsByProfile } from "../../api/bookings/getBookingsByProfile";
import Loader from "../common/Loader";
import Message from "../common/Message";
import BookingList from "../bookings/BookingList";

export default function MyBookings({ auth }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      if (!auth?.name || !auth?.accessToken || !auth?.apiKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getBookingsByProfile(
          auth.name,
          auth.accessToken,
          auth.apiKey
        );

        const sortedBookings = [...data].sort(
          (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
        );

        setBookings(sortedBookings);
        setStatus(null);
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

  return (
    <div className="p-4">
      <h2 className="h5 mb-3">My bookings</h2>

      {loading && <Loader text="Loading bookings..." />}

      {!loading && status?.type === "error" && (
        <Message
          variant="danger"
          title={status.title}
          message={status.message}
          center={false}
        />
      )}

      {!loading && !status && <BookingList bookings={bookings} />}
    </div>
  );
}

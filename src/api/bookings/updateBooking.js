import { BASE_URL } from "../constants";
import { getAuth } from "../../utils/storage/getAuth";

export async function updateBooking(bookingId, data) {
  const auth = getAuth();

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const response = await fetch(`${BASE_URL}/holidaze/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.accessToken}`,
      "X-Noroff-API-Key": auth.apiKey,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to update booking");
  }

  return json.data;
}

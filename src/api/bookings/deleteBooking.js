import { BASE_URL } from "../constants";
import { getAuth } from "../../utils/storage/getAuth";

export async function deleteBooking(bookingId) {
  const auth = getAuth();

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const response = await fetch(`${BASE_URL}/holidaze/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "X-Noroff-API-Key": auth.apiKey,
    },
  });

  if (!response.ok) {
    let message = "Failed to delete booking";

    try {
      const json = await response.json();
      message = json.errors?.[0]?.message || message;
    } catch {
      // No JSON body
    }

    throw new Error(message);
  }

  return true;
}

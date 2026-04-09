import { BASE_URL } from "../constants";
import { getAuth } from "../../utils/storage/getAuth";

export async function createBooking(data) {
  const auth = getAuth();

  console.log("BOOKING auth:", auth);
  console.log("BOOKING payload:", data);

  const response = await fetch(`${BASE_URL}/holidaze/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.accessToken}`,
      "X-Noroff-API-Key": auth.apiKey,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  console.log("BOOKING status:", response.status);
  console.log("BOOKING response:", json);

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to create booking");
  }

  return json.data;
}

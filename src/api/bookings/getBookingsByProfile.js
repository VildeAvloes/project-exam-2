import { BASE_URL } from "../constants";

export async function getBookingsByProfile(name, accessToken, apiKey) {
  if (!name) {
    throw new Error("Profile name is required.");
  }

  if (!accessToken) {
    throw new Error("Access token is required.");
  }

  if (!apiKey) {
    throw new Error("API key is required.");
  }

  const response = await fetch(
    `${BASE_URL}/holidaze/profiles/${name}?_bookings=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json?.errors?.[0]?.message || "Failed to fetch profile bookings."
    );
  }

  return json.data?.bookings || [];
}

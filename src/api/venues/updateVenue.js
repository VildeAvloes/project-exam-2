import { getAuth } from "../../utils/storage/getAuth";
import { BASE_URL } from "../constants";

export async function updateVenue(venueId, data) {
  const auth = getAuth();

  if (!venueId) {
    throw new Error("Venue ID is required");
  }

  const response = await fetch(`${BASE_URL}/holidaze/venues/${venueId}`, {
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
    throw new Error(json.errors?.[0]?.message || "Failed to update venue");
  }

  return json.data;
}

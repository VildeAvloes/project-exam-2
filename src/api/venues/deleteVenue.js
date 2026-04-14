import { getAuth } from "../../utils/storage/getAuth";
import { BASE_URL } from "../constants";

export async function deleteVenue(venueId) {
  const auth = getAuth();

  if (!venueId) {
    throw new Error("Venue ID is required");
  }

  const response = await fetch(`${BASE_URL}/holidaze/venues/${venueId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "X-Noroff-API-Key": auth.apiKey,
    },
  });

  if (!response.ok) {
    let message = "Failed to delete venue";

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

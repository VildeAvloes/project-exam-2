import { getAuth } from "../../utils/storage/getAuth";
import { BASE_URL } from "../constants";

export async function createVenue(data) {
  const auth = getAuth();

  const response = await fetch(`${BASE_URL}/holidaze/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.accessToken}`,
      "X-Noroff-API-Key": auth.apiKey,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to create venue");
  }

  return json.data;
}

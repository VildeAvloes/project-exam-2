import { getAuth } from "../../utils/storage/getAuth";
import { BASE_URL } from "../constants";

export async function getVenuesByProfile(name, query = "") {
  const auth = getAuth();

  if (!name) {
    throw new Error("Profile name is required");
  }

  const response = await fetch(
    `${BASE_URL}/holidaze/profiles/${name}/venues${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
        "X-Noroff-API-Key": auth.apiKey,
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch venues");
  }

  return json.data || [];
}

import { BASE_URL } from "../constants";

export async function getFeaturedVenues() {
  const response = await fetch(
    `${BASE_URL}/holidaze/venues?limit=6&sort=created&sortOrder=desc`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch featured venues");
  }

  const json = await response.json();

  return json.data || [];
}

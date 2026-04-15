import { BASE_URL } from "../constants";

export async function getVenueById(id, query = "") {
  const url = `${BASE_URL}/holidaze/venues/${id}${query}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to fetch venue");
    }

    return json.data;
  } catch (error) {
    return [];
  }
}

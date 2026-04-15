import { BASE_URL } from "../constants";

export async function getVenues(page = 1, allVenues = []) {
  const response = await fetch(
    `${BASE_URL}/holidaze/venues?limit=100&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }

  const json = await response.json();

  const updatedVenues = [...allVenues, ...(json.data || [])];

  if (json.meta?.nextPage) {
    return getVenues(page + 1, updatedVenues);
  }

  return updatedVenues;
}

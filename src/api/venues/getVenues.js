import { BASE_URL } from "../constants";

export async function getVenues() {
  const url = `${BASE_URL}/holidaze/venues`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }

    const json = await response.json();

    return json.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

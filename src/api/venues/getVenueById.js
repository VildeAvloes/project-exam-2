import { BASE_URL } from "./constants";

export async function getVenueById(id) {
  const url = `${BASE_URL}/venues/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch venue");
    }

    const json = await response.json();
    console.log("json:", json);
    console.log("json.data:", json.data);

    return json.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

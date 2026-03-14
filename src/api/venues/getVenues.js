export async function getVenues() {
  const url = "https://v2.api.noroff.dev/holidaze/venues";

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

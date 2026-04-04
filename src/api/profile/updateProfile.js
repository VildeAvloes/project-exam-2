import { BASE_URL } from "../constants";
import { getAuth } from "../../utils/storage/getAuth";

export async function updateProfile(data) {
  const auth = getAuth();

  console.log("AUTH:", auth);
  console.log("UPDATE payload:", data);

  const response = await fetch(`${BASE_URL}/holidaze/profiles/${auth.name}`, {
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
    throw new Error(json.errors?.[0]?.message || "Failed to update profile");
  }

  return json.data;
}

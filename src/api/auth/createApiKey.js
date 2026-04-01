import { BASE_URL, API_KEY_NAME } from "../constants";

export async function createApiKey(accessToken) {
  const response = await fetch(`${BASE_URL}/auth/create-api-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: API_KEY_NAME,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to create API key");
  }

  return json.data.key;
}

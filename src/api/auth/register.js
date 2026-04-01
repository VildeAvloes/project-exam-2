import { BASE_URL } from "../constants";

export async function registerUser({
  name,
  email,
  password,
  venueManager = false,
}) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      venueManager,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to register user");
  }

  return json.data;
}

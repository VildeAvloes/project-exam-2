import { BASE_URL } from "../constants";

export async function loginUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to login");
  }

  return json.data;
}

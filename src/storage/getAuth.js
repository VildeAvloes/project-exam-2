import { AUTH_KEY } from "../api/constants";

export function getAuth() {
  const value = localStorage.getItem(AUTH_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

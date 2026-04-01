import { AUTH_KEY } from "../api/constants";

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

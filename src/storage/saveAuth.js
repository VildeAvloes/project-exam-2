import { AUTH_KEY } from "../api/constants";

export function saveAuth(authData) {
  console.log("Saving auth:", authData);
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
}

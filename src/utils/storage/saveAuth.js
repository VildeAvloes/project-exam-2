import { AUTH_KEY } from "../../api/constants";

export function saveAuth(authData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
}

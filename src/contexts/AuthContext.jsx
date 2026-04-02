import { createContext, useContext, useState } from "react";
import { getAuth } from "../utils/storage/getAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getAuth());

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

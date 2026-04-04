import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "../utils/storage/getAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getAuth());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = getAuth();
    setAuth(storedAuth);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

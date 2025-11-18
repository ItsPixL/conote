// ./context/AuthContext.tsx

// Imports
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { type User, type AuthContextType } from "../utils/types";
import { Navigate } from "react-router-dom";

// Create AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Create Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({ username: "demo" });
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") ?? ""
  );

  // Fetch profile if token exists
  useEffect(() => {
    if (token) {
      // FETCH USER PROFILE HERE ------------------------------------------------------------------ IMPORTANT
      setUser({ username: "demo" });
    }
  }, [token]);

  // Login function
  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser({ username: "" });
  };

  // Provide consumers with user, token, login, logout
  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create Auth Required wrapper for consumers
export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

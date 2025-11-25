// ./context/AuthContext.tsx

// Imports
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { refreshUser } from "../utils/authApi";

// Types
import { type User, type AuthContextType } from "../utils/types";

// Create AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") ?? ""
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!token) return null;
    try {
      setLoading(true);
      const res = await refreshUser();
      const data: User = res.data.data.user;
      setUser(data);
      return data;
    } catch (err) {
      console.error(err);
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hydrate user on reload
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login
  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // Provide context value
  const value = useMemo(
    () => ({ user, token, login, logout, fetchUserProfile, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// RequireAuth wrapper
export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return <div>Loading...</div>; // CHANGE THIS WHEN YOU BUILD THE LOADER -------------------------------------------------------------------
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

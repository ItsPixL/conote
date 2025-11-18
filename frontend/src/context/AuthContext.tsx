import { createContext, useState, useEffect, useContext } from "react";
import { type User, type AuthContextType } from "../utils/types";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      // Fetch user profile with token if needed
      setUser({ username: "demo" });
    }
  }, [token]);

  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

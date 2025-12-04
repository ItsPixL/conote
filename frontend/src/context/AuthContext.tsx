import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { refreshUser } from "../utils/authApi";
import Loader from "../components/Loader";
import type { User, AuthContextType } from "../utils/types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: "",
  login: () => {},
  logout: () => {},
  fetchUserProfile: async () => null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (!token) return null;
    try {
      const res = await refreshUser();
      const data: User = res.data.content.user;
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

  useEffect(() => {
    if (token) fetchUserProfile();
    else setLoading(false);
  }, [token]);

  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, login, logout, fetchUserProfile, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const withAuthGuard = (
  condition: (auth: AuthContextType) => boolean,
  redirect: string
) => {
  return ({ children }: { children: React.ReactElement }) => {
    const auth = useContext(AuthContext);
    if (auth.loading) return <Loader />;
    if (!condition(auth)) return <Navigate to={redirect} replace />;
    return children;
  };
};

export const RequireAuth = withAuthGuard((auth) => !!auth.user, "/login");
export const RequireGuest = withAuthGuard((auth) => !auth.user, "/notes");

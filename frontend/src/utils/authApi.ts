// ./utils/authApi.ts

// Imports
import { api, jwtApi } from "./api";

// Types
import { type LoginData } from "./types";

// Login API
export const logIn = async (formData: LoginData) => {
  const res = await api.post("/auth/login", formData);
  return res;
};

// Signup API
export const signUp = async (formData: LoginData) => {
  const res = await api.post("/auth/signup", formData);
  return res;
};

// Refresh User API
export const refreshUser = async () => {
  const res = await jwtApi.get("/auth/user");
  return res;
};

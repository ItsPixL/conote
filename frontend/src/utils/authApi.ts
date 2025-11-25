import { api, jwtApi } from "./api";
import { type LoginData } from "./types";

export const logIn = async (formData: LoginData) => {
  const res = await api.post("/auth/login", formData);
  return res;
};

export const signUp = async (formData: LoginData) => {
  const res = await api.post("/auth/signup", formData);
  return res;
};

export const refreshUser = async () => {
  const res = await jwtApi.get("/auth/user");
  return res;
};

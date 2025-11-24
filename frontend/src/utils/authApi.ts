import { authApi } from "./api";
import { type LoginData } from "./types";

export const logIn = async (formData: LoginData) => {
  const res = await authApi.post("/auth/login", formData);
  return res;
};

export const signUp = async (formData: LoginData) => {
  const res = await authApi.post("/auth/signup", formData);
  return res;
};

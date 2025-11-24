// api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export const jwtApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

jwtApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

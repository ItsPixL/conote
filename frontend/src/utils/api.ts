import { type SignUpData } from "./types";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust for backend
});

export const signup = (data: SignUpData) => api.post("/auth/signup", data);

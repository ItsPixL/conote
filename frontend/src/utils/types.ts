// ./utils/types.ts

// Imports
import { type AxiosResponse } from "axios";

// Base
export interface User {
  username: string;
  email?: string;
}

// Login and Signup
export interface LoginData {
  email: string;
  password: string;
}

type LoginSuccessPayload = {
  data: {
    token: string;
    user: User;
  };
};

export type LoginSuccessResponse = AxiosResponse<LoginSuccessPayload>;

export type LoginErrorResponse = {
  message?: string;
  success?: boolean;
};

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

// Auth
export type AuthContextType = {
  user: User | null;
  token: string;
  login: (jwt: string, userData: User) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<User | null>;
  loading: boolean;
};

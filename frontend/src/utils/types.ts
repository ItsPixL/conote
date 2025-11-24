export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ErrorResponse {
  message: string;
}

export interface User {
  username: string;
  email?: string;
}

export type AuthContextType = {
  user: User | null;
  token: string;
  login: (jwt: string, userData: User) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<User | null>;
  loading: boolean;
};

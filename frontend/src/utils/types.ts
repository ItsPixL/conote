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

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (jwt: string, userData: User) => void;
  logout: () => void;
}

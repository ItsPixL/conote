export interface SignupFormProps {
  onSuccess: () => void;
}

export interface SignUpData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

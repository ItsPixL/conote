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

export interface SignupFormProps {
  onSuccess: () => void;
}

export interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

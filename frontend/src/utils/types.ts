// ./utils/types.ts

// Imports
import type { AxiosResponse } from "axios";
import type { Dispatch, SetStateAction } from "react";

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
  content: {
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

export interface AuthPageProps {
  title: string;
  subtitle: string;
  redirectText: string;
  redirectPath: string;
  redirectLinkText: string;
  FormComponent: React.ComponentType;
}

export interface Field {
  name: string;
  type?: string;
  placeholder: string;
}

export interface AuthFormProps {
  fields: Field[];
  onSubmit: (formData: LoginData | SignUpData) => Promise<void>;
  buttonText: string;
  declaration: string;
}

// Notes
export type NoteType = {
  id: number;
  userId: number;
  title: string;
  content: string;
  description: string;
  createdTime: string;
  updatedTime: string;
};

export type CreateNoteFormProps = {
  closeForm: () => void;
};

export type StrucNoteEditorProps = {
  note: NoteType;
  setNote: Dispatch<SetStateAction<NoteType | null>>;
  noteId: string;
};

import { AxiosError } from "axios";
import React, { useState } from "react";
import api from "../utils/api";
import { type SignUpData } from "../utils/types";

// Define a type for the expected error response structure
interface ErrorResponse {
  message: string;
}

const SignupForm = () => {
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isAxiosError = (err: unknown): err is AxiosError => {
    return (err as AxiosError).isAxiosError !== undefined;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/signup", formData);
      console.log("Signup success:", res.data);
    } catch (err: unknown) {
      console.error("Signup error:", err);

      // Check if the error is an AxiosError
      if (isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as ErrorResponse;
        const errorMessage = errorData.message;

        if (errorMessage === "Email already exists") {
          setError(
            "This email is already registered. Please use a different one."
          );
        } else if (errorMessage === "Username already exists") {
          setError(
            "This username is already taken. Please choose another one."
          );
        } else {
          setError(
            "An error occurred while signing up. Please try again later."
          );
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
      <p className="declaration">
        By clicking "Sign up", you are agreeing to CoNote's Privacy Policy and
        Terms and Conditions.
      </p>
      {error && (
        <p style={{ color: "red" }} className="error">
          {error}
        </p>
      )}
    </form>
  );
};

export default SignupForm;

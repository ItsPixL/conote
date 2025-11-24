import { AxiosError } from "axios";
import React, { useState } from "react";
import { authApi } from "../utils/api";
import { type SignUpData, type ErrorResponse } from "../utils/types";
import { signUp } from "../utils/authApi";

const SignupForm = () => {
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
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
    setError("");

    try {
      const res = await signUp(formData);
      console.log("Signup success:", res.data.data);
      alert("Sign up successful!"); // CHANGE THIS LATER

      // Catch block
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
        By clicking "Sign Up", you agree to CoNote's Privacy Policy and Terms
        and Conditions.
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

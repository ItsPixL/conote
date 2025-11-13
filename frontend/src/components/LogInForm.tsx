import { AxiosError } from "axios";
import React, { useState } from "react";
import api from "../utils/api";
import { type LoginData, type ErrorResponse } from "../utils/types";

const LoginForm = () => {
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LoginData>({
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
      const res = await api.post("/auth/login", formData);
      console.log("Login success:", res.data);
      alert("Login successful!"); // CHANGE THIS LATER (e.g., redirect)
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as ErrorResponse;
        const errorMessage = errorData.message;

        if (errorMessage === "Invalid credentials") {
          setError("Incorrect email or password. Please try again.");
        } else if (errorMessage === "User not found") {
          setError("No account found with this email.");
        } else {
          setError("An error occurred while logging in. Please try again later.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Log In</button>
      <p className="declaration">
        By clicking "Log in", you agree to CoNote's Privacy Policy and Terms and Conditions.
      </p>
      {error && (
        <p style={{ color: "red" }} className="error">
          {error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
